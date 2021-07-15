export function ApplyValidation(element, message){
  element.setValidationProperty('ValidationMessage', message)
    .setValidationProperty('SeparatorIsHidden', false)
    .setValidationProperty('ValidationViewIsHidden', false)
    .setValidationProperty('ValidationViewBackgroundColor', 'ffebeb')
    .setValidationProperty('ValidationMessageColor', '32363a')
    .setValidationProperty('SeparatorBackgroundColor', 'bb0000')
    .applyValidation();
}

export function IsEmpty(text){
  return !text || text.length <= 0;
}