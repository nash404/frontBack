const functionOfValidation = {
  "void-validation": (field) => {
    return field.text.length !== 0 ? "normal" : `input ${field.nameOfField}`;
  },
  "email-validation": (field) => {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return field.text.match(validRegex) ? "normal" : `email is not correct`;
  },
};

function Validation(data) {
  let statusOfForms = {
    status: true,
    errors: [],
  };
  data.forEach((element) => {
    element.typeOfValidation.forEach((item) => {
      let resultOfValidation = functionOfValidation[item]({
        text: element.value,
        nameOfField: element.nameOfField,
      });
      if (resultOfValidation !== "normal") {
        statusOfForms.errors.push({ type: "Error", text: resultOfValidation });
      }
    });
  });
  if (statusOfForms.errors.length !== 0) statusOfForms.status = false;
  return statusOfForms;
}

export default Validation;
