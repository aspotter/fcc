import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file. Use Pandas to import the data from epa-sea-level.csv.
    df = pd.read_csv('epa-sea-level.csv')

    # Create scatter plot
    # Use matplotlib to create a scatter plot using the Year column as the x-axis and the CSIRO Adjusted Sea Level column as the y-axis.
    fig, ax = plt.subplots(figsize=(12,8))
    ax.scatter(x=df['Year'], y=df['CSIRO Adjusted Sea Level'], marker='.')

    # Create first line of best fit
    # Use the linregress function from scipy.stats to get the slope and y-intercept of the line of best fit. 
    # Plot the line of best fit over the top of the scatter plot. Make the line go through the year 2050 to predict the sea level rise in 2050.
    fit1 = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
    m1, c1 = fit1.slope, fit1.intercept
    x_fit1 = range(1880, 2051)
    y_fit1 = m1 * x_fit1 + c1
    ax.plot(x_fit1, y_fit1, 'g')

    # Create second line of best fit
    # Plot a new line of best fit just using the data from year 2000 through the most recent year in the dataset. 
    # Make the line also go through the year 2050 to predict the sea level rise in 2050 if the rate of rise continues as it has since the year 2000.
    df_2000 = df[df['Year'] >= 2000]
    fit2 = linregress(df_2000['Year'], df_2000['CSIRO Adjusted Sea Level'])
    m2, c2 = fit2.slope, fit2.intercept
    x_fit2 = range(2000, 2051)
    y_fit2 = m2 * x_fit2 + c2
    ax.plot(x_fit2, y_fit2, 'r')

    # Add labels and title
    # The x label should be Year, the y label should be Sea Level (inches), and the title should be Rise in Sea Level.
    ax.set_xlabel('Year')
    ax.set_ylabel('Sea Level (inches)')
    ax.set_title('Rise in Sea Level')
    
    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()