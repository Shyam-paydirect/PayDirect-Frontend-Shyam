import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css', '../../assets/css/master.css'],
})
export class AdminPortalComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  submitForm() {
    const username = (document.getElementById('username') as HTMLInputElement)
      .value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLSelectElement).value;
    const status = (document.getElementById('status') as HTMLSelectElement)
      .value;

    // Create an object with the form data
    const newUser = {
      username: username,
      password: password,
      email: email,
      role: role,
      status: status,
    };

    // Call the signupUser method from UserService
    this.userService.signupUser(newUser).subscribe(
      (response) => {
        this.toastr.success('User created successfully!', 'Success', {
          timeOut: 1500,
        }); // Success toast
        this.closeModal(); // Close modal if needed
      },
      (error) => {
        this.toastr.error(
          'User already exists or invalid data. Please try again.',
          'Error',
          { timeOut: 2000 }
        ); // Error toast
      }
    );
  }

  // Logic to close the modal
  closeModal() {
    const modalElement = document.getElementById('addMemberModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}
