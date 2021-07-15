import * as InputValidator from '../Utils/InputValidator.js';

export default function ValidateEntity(context) {  
  let isValid = true;

  let name = context.evaluateTargetPathForAPI('#Control:name');
  if (name) {
    if (InputValidator.IsEmpty(name.getValue())){
      InputValidator.ApplyValidation(name, 'name' + ' ' + context.localizeText('can_not_be_empty'));
      isValid = false;
    }
  }  

  return isValid;
}
