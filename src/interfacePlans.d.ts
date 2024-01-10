export interface DatePlan {
  type: string;
  data: DataPlan;
}

export interface DataPlan {
  setup: Setuper; // системные параметры по умолчанию
  plans: PlanCoord[]; // планы координации
}

export interface PlanCoord {
  nomPK: number;
  areaPK: number;
  subareaPK: number;
  namePK: string;
  timeCycle: number; // длительность цикла
  ki: number; // коэффициент
  ks: number; // коэффициент
  phaseOptim: boolean; // оптимизировать длительность фаз
  coordPlan: PlanCoordData[];
}

export interface PlanCoordData {
  id: number;
}

export interface Setuper {
  sumPhases: number; // количество фаз
  minDuration: number; // миним. длительность фазы
  optimal: boolean; // участие в автоматической оптимизации
  satur: number; // поток насыщения(т.е./ч.)
  intens: number; // интенсивность(т.е./ч.)
  peregon: number; // Длинна перегона(м)
  dispers: number; // Дисперсия пачки(%)
  offsetBeginGreen: number; // Смещ.начала зелёного(сек)
  offsetEndGreen: number; // Смещ.конца зелёного(сек)
  wtStop: number; // Вес остановки
  wtDelay: number; // Вес задержки
}
