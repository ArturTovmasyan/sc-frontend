import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImgCropperConfig, ImgCropperEvent, LyResizingCroppingImages} from '@alyle/ui/resizing-cropping-images';
import {LyTheme2, ThemeVariables} from '@alyle/ui';
import {AbstractForm} from '../../../../../../../shared/components/abstract-form/abstract-form';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-resident-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent extends AbstractForm implements OnInit {
  @ViewChild('cropping') cropping: ElementRef<LyResizingCroppingImages>;

  classes = this.theme.addStyleSheet((theme: ThemeVariables) => ({
    cropping: {
      maxWidth: '400px',
      height: '300px'
    }
  }));
  cropper_config: ImgCropperConfig = {
    autoCrop: true,
    width: 150, // Default `250`
    height: 150, // Default `200`
  };

  constructor(private formBuilder: FormBuilder, private theme: LyTheme2) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      photo: [null, Validators.required],
    });
  }

  onCropped(e: ImgCropperEvent) {
    this.form.get('photo').setValue(e.dataURL);
  }

  onLoaded(e: ImgCropperEvent) {
    // @ts-ignore
    this.cropping.setScale(1);
    // @ts-ignore
    this.cropping.center();
  }

  onError(e: ImgCropperEvent) {
    this.form.get('photo').setValue(null);
    this.handleSubmitError({
      data: {
        error: 'Crop Error.'
      }
    });
    console.log(e);
  }

  after_set_form_data(): void {
    if (this.form.get('photo').value) {
      // @ts-ignore
      this.cropping.setImageUrl(this.form.get('photo').value);
    }
  }
}
