from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Disabilites(models.Model): #Disabilities created by admin
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    def __str__(self):
        return self.title
class Workouts(models.Model): #Workouts created by admin
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    instructions = models.CharField(max_length=200)
    def __str__(self):
        return self.name
class workoutDisability(models.Model): #Link between workout having multiple disabiltiies that can't use
    disability = models.ForeignKey(Disabilites, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workouts, on_delete=models.CASCADE)

class workoutUser(models.Model): #Link between workout and user. Workout created by user
    title = models.CharField(max_length=200)
    workout = models.ForeignKey(Workouts, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.IntegerField(default=0)
    def __str__(self):
        return self.title

class userPlan(models.Model): #Link between user and plan. Plan created by user
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class WorkoutPlan(models.Model): #Link between plan and workouts. 
    plan = models.ForeignKey(userPlan, on_delete=models.CASCADE)
    workout = models.ForeignKey(workoutUser, on_delete=models.CASCADE)
