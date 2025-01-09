import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# 1
df = pd.read_csv("medical_examination.csv")

# 2
df['overweight'] = ((df['weight'] / ((df['height']/100)**2)) > 25).astype(int)

# 3
df['cholesterol'] = ((df['cholesterol']) > 1).astype(int)
df['gluc'] = ((df['gluc']) > 1).astype(int)

# 4
def draw_cat_plot():
    # 5 Create a DataFrame for the cat plot using pd.melt with values from 
    # cholesterol, gluc, smoke, alco, active, and overweight in the df_cat variable.
    df_cat = pd.melt(df, id_vars=['cardio'], value_vars=['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])


    # 6 Group and reformat the data in df_cat to split it by cardio. Show the counts of each feature. 
    # You will have to rename one of the columns for the catplot to work correctly.
    df_cat['total'] = 1
    df_cat = df_cat.groupby(['cardio', 'variable', 'value'], as_index=False).count()


    # 7 Convert the data into long format and create a chart that shows the value counts of the categorical features 
    # using the following method provided by the seaborn library import: sns.catplot().
    catplot = sns.catplot(df_cat, x='variable', y='total', hue='value', kind='bar', col='cardio')


    # 8 Get the figure for the output and store it in the fig variable.
    fig = catplot.figure

    # 9
    fig.savefig('catplot.png')
    return fig


# 10
def draw_heat_map():
    # 11 Clean the data in the df_heat variable by filtering out the following patient segments that represent incorrect data:
    # diastolic pressure is higher than systolic (Keep the correct data with (df['ap_lo'] <= df['ap_hi']))
    # height is less than the 2.5th percentile (Keep the correct data with (df['height'] >= df['height'].quantile(0.025)))
    # height is more than the 97.5th percentile
    # weight is less than the 2.5th percentile
    # weight is more than the 97.5th percentile
    df_heat = df[(df['ap_lo'] <= df['ap_hi']) 
                & (df['height'] >= df['height'].quantile(0.025)) 
                & (df['height'] <= df['height'].quantile(0.975))
                & (df['weight'] >= df['weight'].quantile(0.025))
                & (df['weight'] <= df['weight'].quantile(0.975))]

    # 12 Calculate the correlation matrix and store it in the corr variable.
    corr = df_heat.corr()

    # 13 Generate a mask for the upper triangle and store it in the mask variable.
    mask = np.triu(corr)


    # 14 Set up the matplotlib figure.
    fig, ax = plt.subplots(figsize = (10,9))
    ax.set_title("Correlation Heatmap")

    # 15 Plot the correlation matrix using the method provided by the seaborn library import: sns.heatmap().
    heatmap = sns.heatmap(data=corr, ax=ax, mask=mask, annot=True, fmt='.1f', square=True)
    fig = heatmap.figure

    # 16
    fig.savefig('heatmap.png')
    return fig
