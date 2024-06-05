export interface ChecklistModel {
    optionDatas: OptionDataModel[],
    timeLimit: TimeLimitModel,
}

export interface TimeLimitModel {
    day: string,
    hour: string,
    minute: string
}

export interface OptionDataModel {
    id: string
    title: string,
    voteNumbers: number,
    voteUsers: string[]
}