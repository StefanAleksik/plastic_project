import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
import pymysql
from sqlalchemy import create_engine
import random
import string


original_file = pd.read_csv('data/orders1week.csv', sep=';')
selected_columns = original_file[['Tillg?nglighet', 'Anl?ggningsutbyte', 'Kvalitetsutbyte', 'TAK']]


def pasrseComas(x):
	if (type(x) == int):
		return float(x)
	else:
		return float(x.replace(",","."))

selected_columns = selected_columns.applymap(lambda x: pasrseComas(x))

#Kmeans
scaler = StandardScaler()
model = KMeans(n_clusters=4)
pipeline = make_pipeline(scaler, model)
pipeline.fit(selected_columns)
#print(selected_columns)
labels = pipeline.predict(selected_columns)
#print(labels)
labels = pd.Series(labels)
original_file['Cluster labels'] = labels.values
#original_file.to_csv('data/output.csv', sep=';', encoding='utf-8')


#Adding a random string for domID
domID = []
for row in original_file['Cluster labels']:
	domID.append(''.join([random.choice(string.ascii_letters) for n in range(11)]))
original_file['domID'] = domID

#To MySQL

engine = create_engine("mysql+pymysql://stefan:"+'3162162as'+"@localhost/test")
original_file.to_sql(name='sample_table2', con=engine, if_exists = 'append', index=False)

#Check the number of clusters

#ks = range(1, 6)
#inertias = []
#for k in ks:
#    model = KMeans(n_clusters=k)
#    model.fit(selected_columns)
#    inertias.append(model.inertia_)
#plt.plot(ks, inertias, '-o')
#plt.show()

