//default constants
const defaultConfig = {
  programName: 'timer-pomodoro',
  maxCountTime: 25, //mins
  maxBreakTime: 5,  //mins
  maxSession: 4,
  longTermBreakTime: 15, //mins (15~30)
  timeDisplayType: 'small',
  soundFilePath: 'Clock-chimes',
  MESSAGE: {
    COUNTDOWN_TIME_FINISHED: '{0}분이 지났어요~~',
    EXCEEDED_MAX_SESSION: '{0}분이 지났어요~~ 총{1}번이나 집중했어요. 조금 더 길게 쉴시간( {2}분 )입니다.',
  }
}

export default defaultConfig
