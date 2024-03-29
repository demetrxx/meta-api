"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errMsg = void 0;
exports.errMsg = {
    // auth
    expiredAccessToken: '1.1',
    googleFailure: '1.2',
    emailNotConfirmed: '1.3',
    noRefreshToken: '1.4',
    invalidRefreshToken: '1.5',
    // questions
    invalidQInput: '2.1',
    invalidQuestionId: '2.3',
    // sessions
    invalidSessionId: '3.1',
    noActiveSession: '3.2',
    // subscriptions & access
    noSubscription: '4.1',
    subscriptionExpired: '4.2',
    userBlocked: '4.3',
    notAdmin: '4.4',
    notOwner: '4.5',
    // users
    invalidEmail: '5.1',
    // payments
    invalidOrderId: '6.1',
    paymentCreationFailed: '6.2',
    invalidPaymentOptionId: '6.3',
    invalidSubsData: '6.4',
    paymentAlreadyExists: '6.5',
    invalidPaymentOptionFinalDate: '6.6',
    // Internal server error
    invalidQuestionData: '500.1',
    invalidThemeProgressesCount: '500.2',
    invalidProfileId: '500.3',
    invalidUserId: '500.4',
    invalidTopicId: '500.5',
    invalidTicketId: '500.6',
    noTickets: '500.7',
    noProfile: '500.8',
};
