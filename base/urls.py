# Add urls here to connect views

from django.urls import path
from . import views

app_name="base"
urlpatterns = [
    path('', views.home, name="home"),
    path("login/", views.loginView, name="login"),
    path("register/", views.registerUser, name="register"),
    path("logout/", views.logoutView, name="logout"),
    path("<int:user_id>/dashboard/calendar/", views.calendar, name="calendar"),
    path('<int:user_id>/dashboard/search/', views.search, name="search"),
    path("<int:user_id>/dashboard/", views.dashboard, name="dashboard"),
    path("<int:user_id>/dashboard/myPlans/", views.myPlans, name="myPlans"),
    path("<int:user_id>/dashboard/myPlans/createPlan/", views.createPlan, name="createPlan"),
    path("<int:user_id>/dashboard/myPlans/create/", views.create, name="create"),
    path("<int:user_id>/dashboard/myPlans/deletePlan/", views.deletePlan, name="deletePlan"),
    path("<int:user_id>/dashboard/myPlans/delete/", views.delete, name="delete"),
    path("<int:user_id>/dashboard/myPlans/createWorkout/", views.createWorkout, name="createWorkout"),
    path("<int:user_id>/dashboard/myPlans/createWork/", views.createWork, name="createWork"),
    path("<int:user_id>/dashboard/myPlans/deleteWorkout/", views.deleteWorkout, name="deleteWorkout"),
    path("<int:user_id>/dashboard/myPlans/deleteWork/", views.deleteWork, name="deleteWork"),
    path("<int:user_id>/dashboard/myPlans/<int:plan_id>/", views.planWorkout, name="planWorkout"),
]





