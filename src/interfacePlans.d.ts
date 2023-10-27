export interface DatePlan {
  type: string;
  plans: PlanCoord[];
}

export interface PlanCoord {
  nomPK: number;
  areaPK: number;
  namePK: string;
  coordPlan: PlanCoordData[];
}

export interface PlanCoordData {
  // area: number;
  id: number;
  // name: string;
}
