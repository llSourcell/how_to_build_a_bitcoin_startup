var groups = [

    {
        label: "Blood Pressure",
        measurements:[
            {
                min: 90,
                max: 129,
                yellow_min: 80,
                yellow_max: 130,
                red_min: 70,
                red_max: 140,
                units: "mmHg",
                label: "Systolic",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 132
                    },
                    {
                        timestamp: 1423742720,
                        value: 128
                    }
                ]
            },
            {
                min: 60,
                max: 80,
                yellow_min: 50,
                yellow_max: 85,
                red_min: 40,
                red_max: 90,
                units: "mmHg",
                label: "Diastolic",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 91
                    },
                    {
                        timestamp: 1423742720,
                        value: 86
                    }
                ]
            }
        ]
    },
    {
        label: "Composition",
        measurements:[
            {
                min: 18.5,
                max: 24.9,
                yellow_min: 18,
                yellow_max: 30,
                red_min: 16,
                red_max: 35,
                units: "",
                label: "Body Mass Index",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 25
                    },
                    {
                        timestamp: 1423742720,
                        value: 24.5
                    }
                ]
            },
            {
                min: 70,
                max: 88,
                yellow_max: 88,
                red_max: 90,
                units: "cm",
                label: "Waist Diameter",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 75.3
                    },
                    {
                        timestamp: 1423742720,
                        value: 73.8
                    }
                ]
            }
        ]
    },

    {
        label: "Activity",
        measurements:[
            {
                min: 8000,
                max: 12000,
                yellow_min: 5000,
                red_min: 3000,
                units: "steps",
                label: "Steps per day",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 4952
                    },
                    {
                        timestamp: 1423742720,
                        value: 8632
                    }
                ]
            },
            {
                min: 150,
                max: 300,
                yellow_min: 75,
                red_min: 40,
                units: "minutes per week",
                label: "Weekly moderate exercise",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 20
                    },
                    {
                        timestamp: 1423742720,
                        value: 80
                    }
                ]
            }
        ]
    },

    {
        label: "Lab Tests",
        measurements:[
            {
                min: 0,
                max: 1,
                yellow_min: 1,
                units: "mmol/L",
                label: "HDL (good cholesterol)",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1.35
                    },
                    {
                        timestamp: 1423742720,
                        value: 1.25
                    }
                ]
            },
            {
                min: 0,
                max: 3,
                units: "mmol/L",
                label: "LDL (bad cholesterol)",
                yellow_max: 3,
                red_max: 3.33,
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 3.25
                    },
                    {
                        timestamp: 1423742720,
                        value: 3.05
                    }
                ]
            },
            {
                min: 0,
                max: 2,
                yellow_max: 2,
                red_max: 2.2,
                units: "mmol/L",
                label: "Triglycerides",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 2.3
                    },
                    {
                        timestamp: 1423742720,
                        value: 1.45
                    }
                ]
            }
        ]
    },

    {
        label: "Sleep",
        measurements:[
            {
                min: 7,
                max: 9,
                yellow_min: 6,
                yellow_max: 11,
                red_min: 5,
                red_max: 12,
                units: "hours",
                label: "Time in Bed",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 6.5
                    },
                    {
                        timestamp: 1423742720,
                        value: 7.5
                    }
                ]
            },
            {
                min: 85,
                max: 100,
                yellow_min: 75,
                red_min: 65,
                units: "%",
                label: "Sleep efficiency",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 72
                    },
                    {
                        timestamp: 1423742720,
                        value: 87
                    }
                ]
            }
        ]
    },

];