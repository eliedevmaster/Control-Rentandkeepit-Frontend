import { Component, OnDestroy, OnInit, ViewEncapsulation,  ContentChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, Injector, ViewChild  } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { Store } from '@ngrx/store';
import { State as AppState, getAuthState, getCompanyState, } from 'app/store/reducers';
import { GetSpaceListForFacility, UpdateFacility, SaveFigure, DeleteFigure, GetSpaceListForSpace, Back, UpdateSpace } from 'app/store/actions';
import { BaseService } from 'app/core/services/base.service';

import { FacilityFormService } from 'app/main/ui/company/facility-form/facility-form.service';
import { User } from 'app/models/user';
import { Facility } from 'app/models/companymanagement/facility';

/**drawing */
import { ShapeComponent } from '../draw-space/components/shape/shape.component';
import { ShapeProperties, MousePosition, Shape } from '../draw-space/model/shape';
import { ShapeType, ToolType } from '../draw-space/model/shape-types';
import { ShapeService } from '../draw-space/service/shape.service';

import { CircleComponent } from '../draw-space/components/circle/circle.component';
import { EllipseComponent } from '../draw-space/components/ellipse/ellipse.component';
import { RectangleComponent } from '../draw-space/components/rectangle/rectangle.component';
import { SquareComponent } from '../draw-space/components/square/square.component';
import { DynamicFormComponent } from 'dynaform';

import { Field } from 'dynaform';

@Component({
  selector: 'app-facility-form',
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FacilityFormComponent implements OnInit {

    hasSelectedSpaces: boolean;
    searchInput: FormControl;
    user: User;
    facilityList: Array<Facility> = [];
    parentType: string;
    parentId: number;

    facilityForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**----------------------drawing -----------------------------------*/

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    willLoading: boolean = true;
    svg: any;
    currentPosition: MousePosition = new MousePosition();

    shapeProperties: ShapeProperties = new ShapeProperties();

    selectedShape: ShapeType;
    shapeValue: string;

    selectedTool: ToolType;

    selectedComponent: ShapeComponent;

    isDragging: boolean = false;
    isDrawing: boolean = false;
    isResizing: boolean = false;
    isSelectingPoints: boolean = false;
    isDeletingShape: boolean = false;
    
    formFields: Field[] = [];


    @ContentChild(TemplateRef, {read: TemplateRef}) shapeTemplate: TemplateRef<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _facilityFormService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _facilityFormService: FacilityFormService,
        private _fuseSidebarService: FuseSidebarService,
        private _store: Store<AppState>,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _baseService: BaseService,
        /**drawing */
        private componentFactoryResolver: ComponentFactoryResolver, 
        private viewContainerRef: ViewContainerRef, 
        private shapeService: ShapeService,
        private _cdref: ChangeDetectorRef,

    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.mapUserStateToModel();
        this._facilityFormService.clearSpaceList();
        this.parentType = this._activatedRoute.snapshot.params.parentType;
        this.parentId = this._activatedRoute.snapshot.params.parentId;
        if(this.parentType == "facility") {
            this._store.dispatch(new GetSpaceListForFacility({facilityId : this.parentId}));
        }
            
        else if(this.parentType == "space") {
            this._store.dispatch(new GetSpaceListForSpace({spaceId : this.parentId}));
        }   
    }

    get shareData(): any {
      return this._baseService.shareFacilityData;
    }
  
    set shareData(value: any) {
      this._baseService.shareFacilityData = value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._facilityFormService.onSelectedSpaceListChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSpaces => {
                this.hasSelectedSpaces = selectedSpaces.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._facilityFormService.onSearchTextChanged.next(searchText);
            });

            // Reactive Form
        this.facilityForm = this._formBuilder.group({
            type          : ['', Validators.required],
            name          : ['', Validators.required],
            description   : ['', Validators.required],
        });

        
        this.setInitFormValues();

        this.selectedShape = ShapeType.NoShape;
        ////console.log('AppComponent shapeProperties:', this.shapeProperties);

        //this.initFigures();
        //this.setInitShapes();
    }

    ngAfterViewChecked(): void 
    {
        if(!this.willLoading)
            return;
        this.initFigures();
        this._cdref.detectChanges();
        this.svg = document.querySelector('.draw-panel');

        if(this.shapeService.getShapeComponents().length != 0)
            this.willLoading = false;
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Reset the search
        this._facilityFormService.onSearchTextChanged.next('');

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.clearShapes();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    setInitFormValues(): void 
    {
        this.shareData = JSON.parse(localStorage.getItem('facility_or_space'));
        if(this.shareData != null) {
            this.facilityForm.controls['type'].setValue(this.shareData.type);
            this.facilityForm.controls['name'].setValue(this.shareData.name);
            this.facilityForm.controls['description'].setValue(this.shareData.description);
        }
    }

    onRegisterOrUpdate(): void
    {
        if(this.parentType == 'facility') {
            const payload = {
                id: this.parentId,
                type: this.facilityForm.value['type'],
                name: this.facilityForm.value['name'],
                description: this.facilityForm.value['description']
            }
            this._store.dispatch(new UpdateFacility({facility : payload}));
        }
        else if(this.parentType == 'space') {
            const payload = {
                id: this.parentId,
                type: this.facilityForm.value['type'],
                name: this.facilityForm.value['name'],
                description: this.facilityForm.value['description']
            }

            this._store.dispatch(new UpdateSpace({space: payload}));
        }
    }
    backPath()
    {
        this._store.dispatch(new Back());
    }
    /**
     * New space
     */
    newSpace(): void
    {
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    mapUserStateToModel(): void
    {
        this.getAuthState().subscribe(state => {
            if(state.user != null) {
                this.user = new User(state.user);
            }
        });
    }
    
    /*mapFacilityListStateToModel(): void
    {
        this.getCompanyState().subscribe(state => {
            if(state.facilityListForMe != null) {

            }
        });
    }*/

    getAuthState()
    {
        return this._store.select(getAuthState);
    }

    getCompanyState()
    {
        return this._store.select(getCompanyState);
    }

    /**-------------------------------drawing ----------------------------------------*/

    selectShape(shapeType: string): void {
        this.selectedShape = ShapeType[shapeType];
        this.shapeValue = ShapeType[this.selectedShape];
        this.isSelectingPoints = false;
        ////console.log('selected shape:', this.selectedShape);
    }

    deleteShape() {
        this.isDeletingShape = true;
        //this.shapeService.removeSelectedShapeComponent(id);
    }
    
    clearShapes(): void {
        this.shapeService.removeAllShapeComponents();
        this.selectedShape = ShapeType.NoShape;
        this.shapeValue = ShapeType[this.selectedShape];
        this.formFields = [];
    }

    getShapes(): ShapeComponent[] {
        return this.shapeService.getShapeComponents();
    }

    getNewShapes(): ShapeComponent[] {
        return this.shapeService.getNewShapeComponents();
    }

    selectTool(toolType: string): void {
        this.selectedTool = ToolType[toolType];
        this.selectedShape = ShapeType.NoShape;
        this.shapeValue = ShapeType[this.selectedShape];
        //console.log('selected tool:', toolType);
        if (this.selectedTool == ToolType.Pointer) {
            if (this.isSelectingPoints) {
                this.selectedComponent.endDrawing();
                this.isSelectingPoints = false;
            }
        }
    }

    getMousePosition(event: MouseEvent) {
        var CTM = this.svg.getScreenCTM();
        this.currentPosition.x = (event.clientX - CTM.e) / CTM.a;
        this.currentPosition.y = (event.clientY - CTM.f) / CTM.d;
    }

    private buildComponent(shapeType: ShapeType): any {
        //console.log('buildComponent for :', shapeType);
        switch (shapeType) {
            case ShapeType.Circle:
                return CircleComponent;
            case ShapeType.Rectangle:
                return RectangleComponent;
            case ShapeType.Square:
                return SquareComponent;
            case ShapeType.Ellipse:
                return EllipseComponent;;           
        }
        return null;
    }

    canSelectPoints(): boolean {
        if (this.selectedShape == ShapeType.PolyLine || this.selectedShape == ShapeType.Path) {
            return true;
        }
        return false;
    }

    deSelectComponents() {
        var shapes = this.getShapes();
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].isSelected = false;
        }
    }

    onMouseDown(event): void {
        this.getMousePosition(event);
        console.log('mouse down SVG : ', this.currentPosition, ', ', event, ', selectedComponent ', this.selectedComponent);
        //console.log('shape list :', this.shapeService.getShapeComponents());
        this.deSelectComponents();        
        if (event.target.classList.contains('draggable')) {
            //console.log('CLASS is DRAGGABLE!!!!!!');
            this.selectedComponent = this.shapeService.findShapeComponent(event.target.id);
            if (this.selectedComponent) {
                //console.log('FOUND COMPONENT:', this.selectedComponent);
                this.selectedComponent.isSelected = true;
                this.shapeProperties = Object.assign({}, this.selectedComponent.shape.shapeProperties);
                //console.log(event.target.id, ' DRAGGING :', this.selectedComponent);
                this.formFields = this.selectedComponent.getFormFields();
                //console.log('form fields : ', this.formFields);
                this.startDragging(event);
            }
        } else if (event.target.classList.contains('resize')) {
            //console.log('CLASS is RESIZE!!!!!!');
            this.selectedComponent = this.shapeService.findShapeComponent(event.target.id);
            if (this.selectedComponent) {
                //console.log('FOUND RESIZECOMPONENT:', this.selectedComponent);
                this.isResizing = true;
            }
        } else if (this.selectedShape != ShapeType.NoShape && !this.isSelectingPoints) {
            let injector = Injector.create([], this.viewContainerRef.parentInjector);
            let factory = this.componentFactoryResolver.resolveComponentFactory(this.buildComponent(this.selectedShape));
            let component = factory.create(injector);
            this.selectedComponent = <ShapeComponent>component.instance;
            this.shapeService.setShapeComponent(this.selectedComponent);

            this.shapeProperties = new ShapeProperties();
            this.shapeProperties.name = this.selectedComponent.shape.shapeProperties.name;
            this.selectedComponent.shape.shapeProperties = Object.assign({}, this.shapeProperties);

            if (this.canSelectPoints()) {
                this.isSelectingPoints = true;
            } else {
                this.isDrawing = true;
                this.selectedComponent.startDrawing(this.currentPosition);
            }
        }
    }

    onMouseMove(event): void {
        this.getMousePosition(event);
        if (this.selectedComponent && (this.isDrawing || this.isSelectingPoints)) {
            //console.log(this.currentPosition);
            this.selectedComponent.draw(this.currentPosition);
        } else if (this.selectedComponent && this.isDragging) {
            //console.log('DRAGGING move !!!');
            this.selectedComponent.drag(this.currentPosition);
            //this.shapeService.addNewShapeComponent(this.selectedComponent);
        
        } else if (this.isResizing) {
            //console.log('RESIZING move !!!');
            this.selectedComponent.resizeShape(this.currentPosition);
        }
    }
    onMouseUp(event): void {
        this.getMousePosition(event);
        //console.log('mouse up svg : ', this.shapeService.getShapeComponents());
        if (this.isSelectingPoints) {
            //console.log('SELECT POINTS!!!! ', this.selectedComponent);
            this.selectedComponent.setPoint(this.currentPosition);
        }

        this.shapeService.addNewShapeComponent(this.selectedComponent);
        if(this.isDeletingShape) {
            this.isDeletingShape = false;
            let shape: ShapeComponent = this.shapeService.findShapeComponent(event.target.id);
            this.shapeService.removeSelectedShapeComponent(shape);
            this._store.dispatch(new DeleteFigure({name: shape.shape.shapeProperties.name}));

            if(this.parentType == 'facility') {
                this._store.dispatch(new GetSpaceListForFacility({facilityId: this.parentId}));
            }
            else
                this._store.dispatch(new GetSpaceListForSpace({spaceId: this.parentId}));

        }

        this.selectedShape = ShapeType.NoShape;
        this.shapeValue = ShapeType[this.selectedShape];
        this.isDrawing = false;
        this.isDragging = false;
        this.isResizing = false;
    }

    startDragging(event): void {
        this.isDragging = true;
        //console.log('startDragging()');
        // Make sure the first transform on the element is a translate transform
    }

    dragComponent(event): void {
        //console.log('dragComponent()');
    }

    endDragging(): void {
        this.selectedComponent = null;
        //console.log('endDragging()');
    }

    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    submit(value: any) {
        //console.log('form values : ', value);
        this.selectedComponent.updateShapeProperties(value);
    }

    getFigureType(figure: ShapeComponent ): number {
        let figure_type_id : number = 0;
        switch(figure.shapeType) {
            case ShapeType.Rectangle:
                figure_type_id = 1;
            break;
            case ShapeType.Square:
                figure_type_id = 2;
            break;
            case ShapeType.Circle:
                figure_type_id = 3;
            break;
            case ShapeType.Ellipse:
                figure_type_id = 4;
            break;
        }
        return figure_type_id;
    }

    saveFigure(): void
    {   
        let shapeTypeArray: Array<number> = [];
        let shapeArray: Array<string> = [];
        let shapeNameArray: Array<string> = [];
        
        this.getNewShapes().forEach(element => {
            shapeTypeArray.push(this.getFigureType(element));
            shapeNameArray.push(element.shape.shapeProperties.name)
            shapeArray.push(JSON.stringify(element.shape));
        })
        const payload = {
            company_id : this.user.role_relation_id,
            parent_type: this.parentType == 'facility' ? 1 : 2,
            parent_id: this.parentId,
            figure_type_ids : shapeTypeArray,
            figure_names: shapeNameArray,
            shapes: shapeArray,
        }
        console.log(payload);
        this._store.dispatch(new SaveFigure({figure: payload}));
        if(this.parentType == 'facility') {
            this._store.dispatch(new GetSpaceListForFacility({facilityId: this.parentId}));
        }
        else
            this._store.dispatch(new GetSpaceListForSpace({spaceId: this.parentId}));
        
        this.shapeService.removeAllNewShapeComponents();
     }


    initFigures(): void {
        this._facilityFormService.spaceList.forEach(element => {
            let shape: any = JSON.parse(element.figure.shape);
            this.setInitFigure(shape, element.figure.figure_type_id);
            //this.ngOnInit();
        });
    }

    setInitFigure(shape: any, typeId: number): void {
        
        let injector = Injector.create([], this.viewContainerRef.parentInjector);
        let type: ShapeType = ShapeType.NoShape;
        switch (typeId) {
            case 1:
                type = ShapeType.Rectangle;
            break;

            case 2:
                type = ShapeType.Square;
            break;

            case 3:
                type = ShapeType.Circle;
            break;

            case 4:
                type = ShapeType.Ellipse;
            break;

            default:
                break;
        }
        let factory = this.componentFactoryResolver.resolveComponentFactory(this.buildComponent(type));
        let component = factory.create(injector);
        let selectedComponent: ShapeComponent = <ShapeComponent>component.instance;

        selectedComponent.shape = shape;
        this.shapeService.setShapeComponent(selectedComponent, true);
    }
}
