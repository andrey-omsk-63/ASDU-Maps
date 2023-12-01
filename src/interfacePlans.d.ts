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
  coordPlan: PlanCoordData[];
}

export interface PlanCoordData {
  id: number;
  // name: string;
}
