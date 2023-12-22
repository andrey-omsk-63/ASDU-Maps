export interface DatePlan {
  type: string;
  data: DataPlan;
}

export interface DataPlan {
  plans: PlanCoord[];
}

export interface PlanCoord {
  nomPK: number;
  areaPK: number;
  subareaPK: number;
  namePK: string;
  timeCycle: number;
  ki: number;
  ks: number;
  phaseOptim: boolean;
  coordPlan: PlanCoordData[];
}

export interface PlanCoordData {
  id: number;
}
