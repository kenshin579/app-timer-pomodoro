// default constants
const defaultConfig = {
  programName: 'timer-pomodoro',
  minuteStrFormat: '{0}:00',
  maxCountTime: 25, // mins
  maxBreakTime: 5, // mins
  maxSession: 4,
  maxLongTermBreakTime: 15, // mins (15~30)
  // timeDisplayType: 'small',
  soundFilePath: 'Clock-chimes',
  MESSAGE: {
    COUNTDOWN_TIME_FINISHED: '{0}분동안 집중해서 작업하셨어요 ~~',
    BREAK_TIME_FINISHED: '{0}분동안 쉬셨어요~~',
    EXCEEDED_BREAK_SESSION: '쉬기보다는 더 집중해서 작업을 할 때입니다!!',
    EXCEEDED_MAX_SESSION: '총{0}번 이상 집중해서 작업했습니다. 조금 더 길게 쉴시간({1}분)입니다.'
  }
}

const RUNNING_MODE = Object.freeze({
  COUNTDOWN_TIME: Symbol('countdownTime'),
  BREAK_TIME: Symbol('breakTime'),
  COUNTDOWN_BREAK_TIME: Symbol('countdownBreakTime')
})
export { defaultConfig, RUNNING_MODE }
