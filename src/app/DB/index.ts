import config from '../config/config';
import { USER_ROLE } from '../modeles/UsersRegistration/userRegistration.constant';
import { User } from '../modeles/UsersRegistration/userRegistration.model';

const superUser = {
  password: config.admin_password,
  role: USER_ROLE.Admin,
  segment: 'Robotic Club Admin',
  teamName: 'Aminul Islam Rakib',
  projectName: 'Function',
  projectDescription: 'This is a demo project description.',
  teamLeaderName: 'John Doe',
  teamLeaderEmail: 'rakib38324@gmail.com',
  teamLeaderPhoneNumber: '123-456-7890',
  teamLeaderFacebookID: 'john.doe.1234',
  teamMembers_1_name: 'Alice Smith',
  teamMembers_1_email: 'alice.smith@example.com',
  teamMembers_1_phoneNumber: '987-654-3210',
  teamMembers_2_name: 'Bob Johnson',
  teamMembers_2_email: 'bob.johnson@example.com',
  teamMembers_2_phoneNumber: '456-789-0123',
  transactionID: 'ABC123XYZ',
  sandMoneyNumber: '1234567890',
};

const seedAdmin = async () => {
  // when database is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.Admin });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedAdmin;
