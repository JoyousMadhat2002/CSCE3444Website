from django.contrib import admin
from .models import Disabilites, Workouts, workoutDisability, workoutUser, userPlan, WorkoutPlan

models_to_register = [Disabilites, Workouts, workoutDisability, workoutUser, userPlan, WorkoutPlan]

for model in models_to_register:
    admin.site.register(model)
