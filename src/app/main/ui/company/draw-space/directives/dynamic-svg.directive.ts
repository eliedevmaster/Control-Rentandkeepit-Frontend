import { Directive, Input, ViewContainerRef, OnInit } from '@angular/core';
import { ShapeComponent } from '../components/shape/shape.component';
import { ShapeService } from '../service/shape.service';


@Directive({
  selector: '[dynamic]'
})
export class DynamicSvgDirective {

  @Input() component: ShapeComponent;

  constructor(private viewContainerRef: ViewContainerRef, private shapeService: ShapeService) {
    //console.log('Directive constructor');
    //console.log("Ref:", viewContainerRef);
  }

  ngOnInit() {
      console.log('DynamicSvgDirective ngOnInit() - component : ', this.component);

      //let shapeComponent: ShapeComponent = this.shapeService.getShapeComponent();
      //console.log("Ref1:", this.viewContainerRef);
      //console.log("Ref2:", this.viewContainerRef.createEmbeddedView);
      //console.log("!!!!!!!!!!!!!!!!!!!!!!");
      //console.log("Ref3:", shapeComponent);
      this.viewContainerRef.createEmbeddedView(this.component.shapeTemplate);
  }

  ngOnDestroy() {
      //console.log('DynamicSvgDirective ngOnDestroy()');
      this.viewContainerRef.clear();
  }
}