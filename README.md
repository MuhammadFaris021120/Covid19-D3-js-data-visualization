# Interactive Visualization Application: Malaysia's Response to COVID-19

## Overview
The interactive visualization application titled **"How Is Malaysia Coping with COVID-19 in Terms of Growth and Economy?"** analyzes Malaysia's response to the COVID-19 pandemic by leveraging multiple datasets. The focus is on understanding the public health impacts and economic resilience during this challenging period.

The application utilizes the following datasets:
- **malaysia.geojson** (24,913 rows): Geographical data for Malaysia.
- **newcases.csv** (5 columns, 81 rows): Daily new COVID-19 cases by state from 2020 to mid-2024.
- **newdeath.csv** (10 columns, 81 rows): Daily new COVID-19 deaths by state from 2020 to mid-2024.
- **Malaysia-population.csv** (3 columns, 152 rows): Population data from 1950 to projected 2100.
- **Producer Price Index (PPI)** (7 columns, 173 rows): PPI data from 2010 to mid-2024 across various sectors.
- **Annual GDP & GNI** (6 columns, 108 rows): Economic growth data from 1970 to 2023.
- **Annual Death & Annual Birth** (3 columns each, 24 rows each): Death and birth counts from 2000 to 2022.

These datasets were chosen to provide a comprehensive view of Malaysia's health and economic responses to the pandemic, facilitating a nuanced analysis of the health impacts and economic resilience.

## Selected Datasets

### 1. malaysia.geojson (24,913 Rows)
This dataset contains geographical data for Malaysia in GeoJSON format, which includes the coordinates defining the boundaries of Malaysia's states.

### 2. newcases.csv (5 Columns, 81 Rows)
This dataset captures the daily new COVID-19 cases reported for each state in Malaysia from 2020 to the second quarter of 2024. It includes the year, state, number of new cases, and the corresponding latitude and longitude for each state.

### Data Transformation
- **Aggregation**: Daily new cases are aggregated into yearly totals for clearer analysis of the annual impact of COVID-19 across different states.
- **Geographical Data**: Latitude and longitude coordinates have been added to facilitate spatial analysis of new COVID-19 cases on a map.

### Patterns and Trends
- **Yearly Trends**: A significant increase in COVID-19 cases from 2020 to 2021 was observed, followed by a gradual decrease from 2022 to 2024. For instance, Johor reported 5,734 cases in 2020, which surged to 239,206 in 2021, and then decreased to 15,2843 in 2022, 9,124 in 2023, and 7,231 in 2024.
- **Geographical Distribution**: States like Selangor, Sabah, and W.P. Kuala Lumpur consistently reported higher new cases, likely due to higher population density.

### 3. newdeath.csv (10 Columns, 81 Rows)
This dataset documents daily new COVID-19 deaths reported for each state in Malaysia from 2020 to 2024, including cumulative deaths for each year.

### Data Transformation
- **Aggregation and Calculation**: New deaths data has been aggregated to show yearly totals, with cumulative deaths calculated for each year.
- **Geographical Data**: Similar to the new cases dataset, latitude and longitude coordinates have been included for spatial analysis.

### Patterns and Trends
- **Yearly Trends**: A significant increase in COVID-19 deaths from 2020 to 2021 was followed by a gradual decrease from 2022 to 2024. For example, Johor reported 133 deaths in 2020, which surged to 13,207 in 2021, then decreased to 3,549 in 2022, 608 in 2023, and 53 in 2024.
- **Cumulative Deaths**: The cumulative death counts illustrate the overall impact of COVID-19 over the years.

### 4. malaysia-population.csv (3 Columns, 152 Rows)
This dataset tracks Malaysia's population from 1950 to projected 2100, providing insights into historical and future population trends.

### Patterns and Trends
- **Population Growth**: Initially high growth rates peaked around the 1960s and gradually declined, reflecting demographic shifts and socio-economic changes.
- **Annual Percentage Change**: This column indicates a steady decrease in the annual growth rate percentage over decades.

### 5. Producer Price Index (PPI) (7 Columns, 173 Rows)
This dataset includes PPI data from 2010 to 2024 for various sectors. Notable trends include:
- An overall increasing trend in the PPI from 98.4 in January 2010 to 121.2 in April 2024, indicating rising production costs and prices.
- Fluctuations in the agricultural and mining indices, influenced by external factors such as weather conditions and global commodity prices.

### 6. Annual GDP & GNI (6 Columns, 108 Rows)
This dataset details Malaysia's economic growth from 1970 to 2023, highlighting significant trends:
- **Economic Growth**: Both GDP and GNI have shown substantial growth, with GDP rising from 73,709.682 million in 1970 to 1,568,000 million in 2023.
- **Year-on-Year Growth**: Most years indicate positive growth rates, with notable downturns during economic crises.

## Conclusion
The combination of these datasets provides a holistic view of Malaysia's health and economic responses to the COVID-19 pandemic. By visualizing these trends and patterns, the application aims to facilitate better understanding and decision-making in public health and economic policy.


Visualization charts/dashboards overview
![image](https://github.com/user-attachments/assets/a101c4ea-7225-48c6-8faa-438e85ab50ec)

Figure 1: Covid-19 and Economic Impact Section

![image](https://github.com/user-attachments/assets/119f2e64-35c5-49c4-a3d8-c7034ac1a529)

Figure 2: Covid-19 and Growth Impact Section

