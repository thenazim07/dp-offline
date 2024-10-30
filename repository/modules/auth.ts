import { Login, LoginResponse, Register, RegisterResponse } from 'types/auth';

import HttpFactory from '../factory';

class AuthModule extends HttpFactory {
    private LOGIN = '/login';
    private REGISTER = '/doctors/registration';
    private RE_SEND_OTP = '/otp/send';
    private OTP_VERIFY = '/doctors/otp/verify';
    private LOGOUT = '/logout';

    async login(credentials: Login): Promise<LoginResponse> {
        return await this.call<ILoginResponse>('POST', `${this.LOGIN}`, credentials);
    }

    async register(account: Register): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('POST', `${this.REGISTER}`, account);
    }

    async getProfile() {
        return await this.call<any>('GET', `/doctors/profile`, undefined);
    }

    async profilePhoto(photo: Register): Promise<RegisterResponse> {
        return await this.call<ICreateAccountResponse>('POST', `/users/profile-photo`, photo, { file: 'file' });
    }

    async uploadDocument(document: Register): Promise<RegisterResponse> {
        if (document.get('document')) {
            return await this.call<ICreateAccountResponse>('POST', `/doctors/documents`, document, { file: 'File' });
        }

        const data = {
            document_type: document.get('document_type'),
            description: document.get('description'),
        };

        return await this.call<ICreateAccountResponse>('POST', `/doctors/documents`, data);
    }

    async resendOTP(contactNumberWithCountryCode: object): Promise<Otp> {
        return await this.call<OTPResponse>('POST', `${this.RE_SEND_OTP}`, contactNumberWithCountryCode);
    }

    async verifyOTP(otp_verify: Object): Promise<OtpVerify> {
        return await this.call<OTPResponse>('POST', `${this.OTP_VERIFY}`, otp_verify);
    }

    async logout(): Promise<LogoutResponse> {
        return await this.call<LogoutResponse>('POST', `${this.LOGOUT}`);
    }

    // forgot password
    async sendMobileNumber(mobileNumber: any): Promise<LoginResponse> {
        return await this.call<ICreateAccountResponse>('POST', `/password/reset`, mobileNumber);
    }

    async verifyOTPForResetPassword(otpWithCountryCode: any): Promise<LoginResponse> {
        return await this.call<ICreateAccountResponse>('PUT', `password/reset/otp/verify`, otpWithCountryCode);
    }

    async changePassword(passwords: any): Promise<LoginResponse> {
        return await this.call<ICreateAccountResponse>('PUT', `/update/password`, passwords);
    }

    async resetPassword(passwordWithToken: any): Promise<LoginResponse> {
        return await this.call<ICreateAccountResponse>('PUT', `/password/reset`, passwordWithToken);
    }
}

export default AuthModule;
