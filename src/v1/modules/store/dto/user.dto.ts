import { IsEmail, IsString, IsNotEmpty, Length, IsStrongPassword } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  phone_number!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @IsStrongPassword()
  password!: string;

  @IsString()
  country!: string;

  @IsNotEmpty()
  @IsString()
  country_code!: string;
}

export class LoginUserDTO {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
