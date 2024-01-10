export const dataPlan = {
  type: "planInfo",
  data: {
    setup: {
      sumPhases: 3, // количество фаз
      minDuration: 8, // миним. длительность фазы
      optimal: false, // участие в автоматической оптимизации
      satur: 3600, // поток насыщения(т.е./ч.)
      intens: 600, // интенсивность(т.е./ч.)
      peregon: 250, // Длинна перегона(м)
      dispers: 50, // Дисперсия пачки(%)
      offsetBeginGreen: 8, // Смещ.начала зелёного(сек)
      offsetEndGreen: 0, // Смещ.конца зелёного(сек)
      wtStop: 0, // Вес остановки
      wtDelay: 0, // Вес задержки
    },
    plans: [
      {
        nomPK: 1,
        areaPK: 1,
        subareaPK: 3,
        namePK: "План координации (26.10.2023 13:35:01)12345678901234567890",
        timeCycle: 80,
        ki: 100,
        ks: 100,
        phaseOptim: true,
        coordPlan: [
          {
            id: 139,
          },
          {
            id: 61,
          },
          {
            id: 42,
          },
          {
            id: 39,
          },
        ],
      },
      {
        nomPK: 6,
        areaPK: 1,
        subareaPK: 3,
        namePK: "План координации (25.10.2023 12:12:12)",
        timeCycle: 80,
        ki: 100,
        ks: 100,
        phaseOptim: true,
        coordPlan: [
          {
            id: 39,
          },
          {
            id: 38,
          },
          {
            id: 36,
          },
          {
            id: 35,
          },
        ],
      },
      {
        nomPK: 24,
        areaPK: 1,
        subareaPK: 3,
        namePK: "!!!План координации (28.10.2023 12:12:12)",
        timeCycle: 80,
        ki: 100,
        ks: 100,
        phaseOptim: true,
        coordPlan: [
          {
            id: 34,
          },
          {
            id: 35,
          },
          {
            id: 36,
          },
          {
            id: 38,
          },
        ],
      },
    ],
  },
};
