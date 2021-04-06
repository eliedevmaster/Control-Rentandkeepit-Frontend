import { Injectable } from '@angular/core';
import { ShapeComponent } from '../components/shape/shape.component';

@Injectable()
export class ShapeService {

    private shapesComponents: ShapeComponent[] = [];
    private newShapesComponents: ShapeComponent[] = [];
    private deleteShapesComponents: ShapeComponent[] = [];
    
    private selectedComponent: ShapeComponent;

    constructor() {
        //console.log('ShapeService constructor() :', this.selectedComponent);
    }

    getShapeComponents(): ShapeComponent[] {
        //console.log("SHAPES from service:", this.shapesComponents);
        return this.shapesComponents;
    }
    getNewShapeComponents(): ShapeComponent[] {
        return this.newShapesComponents;
    }

    removeAllNewShapeComponents(): void {
        this.newShapesComponents = [];

    }
    removeAllShapeComponents(): void {
        this.shapesComponents = [];
    }
    
    removeSelectedShapeComponent(shape: ShapeComponent): void {
        this.shapesComponents = this.shapesComponents.filter(obj => obj !== shape);
        this.newShapesComponents = this.newShapesComponents.filter(obj => obj !== shape);

        this.deleteShapesComponents.push(shape);
    }

    setShapeComponent(component: ShapeComponent, isOld: boolean = false): void {
        this.selectedComponent = component;
        this.shapesComponents.push(component);
        if(!isOld)
            this.newShapesComponents.push(component);
    }

    addNewShapeComponent(component: ShapeComponent): void {
        if(this.newShapesComponents.length != 0) {
            this.newShapesComponents = this.newShapesComponents.filter(
                obj => obj.shape.shapeProperties.name !== component.shape.shapeProperties.name); 
        }         
        this.newShapesComponents.push(component);
    }

    getShapeComponent(): ShapeComponent {
        return this.selectedComponent;
    }

    findShapeComponent(name: string): ShapeComponent {
        //console.log('find name : ', name);
        return this.shapesComponents.find(x => x.shape.shapeProperties.name == name);
    }
}
