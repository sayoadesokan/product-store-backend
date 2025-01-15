import Validator from 'validatorjs';

// Define custom validators here
export const initializeCustomValidators = () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  Validator.register(
    'name',
    (value: any) => {
      return /^[a-zA-Z-]{2,100}$/.test(value);
    },
    'The :attribute field is not valid',
  );

  Validator.register(
    'username',
    (value: any) => {
      return /^[a-zA-Z-][a-zA-Z0-9_-]{1,20}$/.test(value);
    },
    'The :attribute field is not valid',
  );

  Validator.register(
    'uuid',
    (value: any) => {
      return uuidRegex.test(value);
    },
    ':attribute is not a valid UUID',
  );

  Validator.register(
    'isIn',
    (value: any, requirement: string) => {
      return (
        requirement.split(',').findIndex((element) => {
          return element.toLowerCase() === value.toLowerCase();
        }) !== -1
      );
    },
    'The :attribute must be one of the allowed values',
  );
};

export default Validator;
