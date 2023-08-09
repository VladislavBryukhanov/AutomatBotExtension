import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExtraMetadata } from '../../types/connector-events';

@Component({
  selector: 'app-input-action',
  templateUrl: './input-action.component.html',
  styleUrls: ['./input-action.component.scss']
})
export class InputActionComponent {
  @Input() label: string;
  @Input() extraMessageMetadata: ExtraMetadata;
  @Output() extraMessageMetadataChange = new EventEmitter<ExtraMetadata>();

  handleInputChange(inputText: string) {
    return this.extraMessageMetadataChange.emit({ ...this.extraMessageMetadata, inputText });
  }
}
