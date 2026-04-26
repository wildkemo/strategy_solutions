export class UserDto {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.phone = user.phone;
    this.companyName = user.companyName;
    this.isActivated = user.isActivated;
    this.createdAt = user.createdAt;
  }
}
