var groups = [
	{
        label: "Physical activity",
        measurements:[
            {
                min: 7000,
                max: 22000,
                yellow_min: 4000,
                red_min: 2000,
                units: "steps",
                label: "Steps / day (1 wk average)",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1952
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
                label: "Moderate intensity exercise",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 40
                    },
                    {
                        timestamp: 1423742720,
                        value: 140
                    }
                ]
            },
			{
                min: 75,
                max: 150,
                units: "minutes per week",
                label: "Vigorous intensity exercise",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 0
                    },
                    {
                        timestamp: 1423742720,
                        value: 0
                    }
                ]
            },
			{
                min: 2,
                max: 7,
                yellow_min: 1,
                red_min: 0,
                units: "times per week",
                label: "Muscle and balance exercise",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 0
                    },
                    {
                        timestamp: 1423742720,
                        value: 2
                    }
                ]
            }
        ]
    },
	{
        label: "Fitness",
        measurements:[
            {
                min: 40,
                max: 80,
                yellow_min: 39,
                red_min: 20,
				yellow_max: 81,
				red_max: 100,
                units: "bpm",
                label: "Resting heart rate",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 75
                    },
                    {
                        timestamp: 1423742720,
                        value: 70
                    }
                ]
            },
            {
                min: 90,
                max: 150,
                yellow_min: 89,
                red_min: 70,
                units: "",
                label: "Fitness index",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 70
                    },
                    {
                        timestamp: 1423742720,
                        value: 90
                    }
                ]
            },
			{
                min: 3,
                max: 5,
                yellow_min: 2,
                red_min: 1,
                units: "",
                label: "Muscular force",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1
                    },
                    {
                        timestamp: 1423742720,
                        value: 2
                    }
                ]
            },
			{
                min: 4,
                max: 5,
                yellow_min: 3,
                red_min: 2,
                units: "",
                label: "Muscular endurance",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 2
                    },
                    {
                        timestamp: 1423742720,
                        value: 4
                    }
                ]
            },
			{
                min: 50,
                max: 60,
                yellow_min: 40,
                red_min: 29,
                units: "s",
                label: "Balance",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 52
                    },
                    {
                        timestamp: 1423742720,
                        value: 52
                    }
                ]
            }
        ]
    },
	{
        label: "Nutrition",
        measurements:[
            {
                min: 3,
                max: 6,
                yellow_min: 2,
                red_min: 1,
                units: "",
                label: "Regularity",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 3
                    },
                    {
                        timestamp: 1423742720,
                        value: 5
                    }
                ]
            },
            {
                min: 2,
                max: 5,
                yellow_min: 1,
                red_min: 0,
                units: "",
                label: "Vegetables, berries & fruit",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1
                    },
                    {
                        timestamp: 1423742720,
                        value: 3
                    }
                ]
            },
			{
                min: 0,
                max: 10,
                yellow_max: 11,
                red_max: 15,
                units: "E%",
                label: "Sugar",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 20
                    },
                    {
                        timestamp: 1423742720,
                        value: 10
                    }
                ]
            },
			{
                min: 18,
                max: 27,
                yellow_min: 17,
                red_min: 10,
                units: "",
                label: "Fat quality",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 15
                    },
                    {
                        timestamp: 1423742720,
                        value: 20
                    }
                ]
            },
			{
                min: 25,
                max: 35,
                yellow_min: 20,
                red_min: 15,
                units: "g/day",
                label: "Fiber",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 20
                    },
                    {
                        timestamp: 1423742720,
                        value: 30
                    }
                ]
            },
			{
                min: 3,
                max: 13,
                yellow_max: 16,
                red_max: 19,
                units: "",
                label: "Salt",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 16
                    },
                    {
                        timestamp: 1423742720,
                        value: 10
                    }
                ]
            }
        ]
    },
	
	{
        label: "Body composition",
        measurements:[
            {
                min: 18.5,
                max: 24.9,
                yellow_min: 18,
                red_min: 16,
				yellow_max: 30,
				red_max: 35,
                units: "",
                label: "Body Mass Index",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 31
                    },
                    {
                        timestamp: 1423742720,
                        value: 29
                    }
                ]
            },
            {
                min: 68,
                max: 78,
                yellow_max: 79,
                red_max: 83,
                units: "kg",
                label: "Weight",
                samples: [  
                    {
                        timestamp: 1420798224,
                        value: 82
                    },
                    {
                        timestamp: 1423742720,
                        value: 78
                    }
                ]
            },
			{
                min: 60,
                max: 80,
                yellow_max: 81,
                red_max: 88,
                units: "cm",
                label: "Waist diameter",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 89
                    },
                    {
                        timestamp: 1423742720,
                        value: 83
                    }
                ]
            },
			{
                min: 23,
                max: 33.9,
                yellow_min: 22.9,
                red_min: 12,
				yellow_max: 34,
				red_max: 40,
                units: "%",
                label: "Fat%",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 40
                    },
                    {
                        timestamp: 1423742720,
                        value: 38
                    }
                ]
            }
        ]
    },
	
	{
        label: "Emotional wellbeing",
        measurements:[
            {
                min: 0,
                max: 9,
                yellow_max: 10,
                red_max: 12,
                units: "",
                label: "Depression",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 5
                    },
                    {
                        timestamp: 1423742720,
                        value: 5
                    }
                ]
            },
            {
                min: 10,
                max: 60,
                yellow_max: 65,
                red_max: 75,
				yellow_min: 5,
                units: "%",
                label: "Stress level",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 50
                    },
                    {
                        timestamp: 1423742720,
                        value: 48
                    }
                ]
            },
			{
                min: 75,
                max: 100,
                yellow_min: 74,
                red_min: 50,
                units: "%",
                label: "Ability to recover from stress",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 80
                    },
                    {
                        timestamp: 1423742720,
                        value: 85
                    }
                ]
            },
			{
                min: 4,
                max: 5,
                yellow_min: 2,
                red_min: 1,
                units: "",
                label: "Positivity towards the future",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 4
                    },
                    {
                        timestamp: 1423742720,
                        value: 4
                    }
                ]
            }
        ]
    },
	
	  {
        label: "Drugs",
        measurements:[
            {
                min: 1,
                max: 1,
                yellow_max: 3,
                red_max: 4,
                units: "",
                label: "Tobacco usage",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1
                    },
                    {
                        timestamp: 1423742720,
                        value: 1
                    }
                ]
            },
            {
                min: 0,
                max: 7,
                yellow_max: 10,
                red_max: 16,
                units: "",
                label: "Alcohol usage",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 4
                    },
                    {
                        timestamp: 1423742720,
                        value: 2
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
                label: "Sleep time",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 8
                    },
                    {
                        timestamp: 1423742720,
                        value: 8.2
                    }
                ]
            },
            {
                min: 0,
                max: 7,
                yellow_max: 8,
                red_max: 14,
                units: "",
                label: "Sleep difficulties",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 1
                    },
                    {
                        timestamp: 1423742720,
                        value: 1
                    }
                ]
            }
        ]
    },
	
	{
        label: "Lab Tests",
        measurements:[
            {
                min: 1,
                max: 1.2,
                yellow_min: 0.99,
				red_min: 0.5,
                units: "mmol/L",
                label: "HDL (good cholesterol)",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 0.8
                    },
                    {
                        timestamp: 1423742720,
                        value: 1.1
                    }
                ]
            },
            {
                min: 0,
                max: 3,
                units: "mmol/L",
                label: "LDL (bad cholesterol)",
                yellow_max: 3.1,
                red_max: 6,
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 4
                    },
                    {
                        timestamp: 1423742720,
                        value: 3
                    }
                ]
            },
            {
                min: 2,
                max: 5,
                yellow_max: 5.1,
                red_max: 8,
                units: "mmol/L",
                label: "Cholesterol",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 6
                    },
                    {
                        timestamp: 1423742720,
                        value: 5
                    }
                ]
            },
			 {
                min: 4,
                max: 6,
                yellow_max: 6.1,
                red_max: 7,
                units: "mmol/L",
                label: "FP-Gluk",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 6.8
                    },
                    {
                        timestamp: 1423742720,
                        value: 5.9
                    }
                ]
            },
			 {
                min: 4,
                max: 6,
                yellow_max: 6,
                red_max: 6.5,
                units: "%",
                label: "HbA1c",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 6.2
                    },
                    {
                        timestamp: 1423742720,
                        value: 5.7
                    }
                ]
            },
			{
                min: 0,
                max: 2,
                yellow_max: 2,
                red_max: 5,
                units: "mmol/L",
                label: "Trigly",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 2.5
                    },
                    {
                        timestamp: 1423742720,
                        value: 1.9
                    }
                ]
            },
			{
                min: 117,
                max: 155,
                yellow_max: 155.1,
                red_max: 170,
				yellow_min: 117,
				red_min: 100,
                units: "g/L",
                label: "Hemoglobine",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 130
                    },
                    {
                        timestamp: 1423742720,
                        value: 132
                    }
                ]
            }
        ]
    },

	
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
                        value: 138
                    },
                    {
                        timestamp: 1423742720,
                        value: 128
                    }
                ]
            },
            {
                min: 60,
                max: 84,
                yellow_min: 50,
                yellow_max: 85,
                red_min: 40,
                red_max: 90,
                units: "mmHg",
                label: "Diastolic",
                samples: [
                    {
                        timestamp: 1420798224,
                        value: 85
                    },
                    {
                        timestamp: 1423742720,
                        value: 80
                    }
                ]
            }
        ]
    },

];