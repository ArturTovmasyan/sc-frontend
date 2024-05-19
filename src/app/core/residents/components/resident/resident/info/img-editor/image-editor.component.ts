import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalFormService} from '../../../../../../../shared/services/modal-form.service';
import {CropperComponent} from 'angular-cropperjs';

@Component({
  selector: 'app-resident-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent extends AbstractForm implements OnInit {
  imageUrl: any;

  cropperConfig: object = {
    movable: true,
    scalable: true,
    zoomable: true,
    viewMode: 2,
    checkCrossOrigin: false,
    cropend: (event) => {
      this.exportImage();
    }
  };

  @ViewChild('angularCropper', {static: false}) public angularCropper: CropperComponent;

  constructor(
    protected modal$: ModalFormService,
    private formBuilder: FormBuilder,
  ) {
    super(modal$);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      photo: [null, Validators.required],
    });
  }

  exportImage() {
    this.form.get('photo').setValue(this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/png'));
  }

  readyImage(event) {
    this.angularCropper.cropper.scale(1, 1);
    this.exportImage();
  }

  rotate(turn: string): void {
    this.angularCropper.cropper.rotate(turn === 'left' ? -45 : 45);

    this.exportImage();
  }

  zoom(status: string): void {
    this.angularCropper.cropper.zoom(status === 'positive' ? 0.1 : -0.1);

    this.exportImage();
  }

  move(offsetX: number, offsetY: number): void {
    this.angularCropper.cropper.move(offsetX, offsetY);

    this.exportImage();
  }

  flip(direction: string): void {
    if (direction === 'x') {
      this.angularCropper.cropper.scaleX(-1);
    } else {
      this.angularCropper.cropper.scaleY(-1);
    }

    this.exportImage();
  }

  reset() {
    this.angularCropper.cropper.reset();

    this.exportImage();
  }

  after_set_form_data(): void {
    if (this.form.get('photo').value) {
      this.imageUrl = this.form.get('photo').value;
    }
  }
}
