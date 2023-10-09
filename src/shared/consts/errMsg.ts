export const errMsg = {
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

  // Internal server error
  invalidQuestionData: '500.1',
  invalidThemeProgressesCount: '500.2',
  invalidProfileId: '500.3',
  invalidUserId: '500.4',
  noTickets: '500.5',
} as const;
