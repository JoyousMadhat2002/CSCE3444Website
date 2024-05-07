from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse as django_reverse
from django.template import loader
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .forms import UserRegistrationForm
from .models import userPlan, WorkoutPlan, workoutUser, Workouts
from django.contrib.auth.decorators import login_required
#Fix @Login_required

# Home page
def home(request):
    if request.user.is_authenticated:
        user_id = request.user.pk
        return render(request, 'index.html', {'user_id': user_id})
    return render(request, 'index.html')


# User registration
def registerUser(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, f'Account created for {username}')
            return redirect('base:dashboard', user_id=user.pk)
    else:
        form = UserRegistrationForm()
    return render(request, "base/register.html", {"form": form})

# User login
def loginView(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('base:dashboard', user_id=user.pk)
        else:
            messages.success(request, 'Username does not exist')
            return redirect('base:login')
    else:
        context = {}
        return render(request, "base/login.html", context)

# User logout
def logoutView(request):
    logout(request)
    messages.success(request, 'You are logged out successfully')
    return redirect('base:home')
# Calendar
def calendar(request, user_id):
    template = loader.get_template("base/calendar.html")
    context = {"user_id" : user_id}
    return HttpResponse(template.render(context,request))

# Search
@login_required
def search(request, user_id):
    q=""
    if request.method == "POST":
        q = request.POST['q']
        workouts = Workouts.objects.filter(name__contains=q)
        template = loader.get_template("search.html")
        context = {'q' : q, 'workouts' : workouts, 'user_id': user_id}
        return HttpResponse(template.render(context,request))
    else:
        workouts = Workouts.objects.none()
        template = loader.get_template("search.html")
        context = {'workouts' : workouts, 'user_id': user_id}
        return HttpResponse(template.render(context,request))

# Dashboard view
@login_required
def dashboard(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    template = loader.get_template("DashboardPage.html")
    user = User.objects.get(pk=user_id)
    context = {"User": user, "user_id": user_id}
    return HttpResponse(template.render(context, request))

# User plans
@login_required
def myPlans(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    plans_list = userPlan.objects.order_by("-user_id")
    user = User.objects.get(pk=user_id)
    template = loader.get_template("myPlans.html")
    context = {"plans_list": plans_list, "user_id": user_id, "user": user}
    return HttpResponse(template.render(context, request))

# User workouts for specific plan
@login_required
def planWorkout(request, user_id, plan_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    user = get_object_or_404(User, pk=user_id)
    workoutToPlanList = WorkoutPlan.objects.order_by("-plan_id")
    workoutToUserList = workoutUser.objects.order_by("-user_id")
    workoutDefaultsList = Workouts.objects.order_by("-id")
    plan = userPlan.objects.get(pk=plan_id)
    template = loader.get_template("planWorkouts.html")
    context = {
        "workoutToPlanList": workoutToPlanList,
        "user": user,
        "plan_id": plan_id,
        "workoutToUserList": workoutToUserList,
        "workoutDefaultsList": workoutDefaultsList,
        "user_id": user_id,
        "plan": plan
    }
    return HttpResponse(template.render(context, request))

# Create plan
@login_required
def create(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    workout_list = request.POST["workouts"]
    usPlan = userPlan(description=request.POST["textfield"], user_id = user_id,name = request.POST["title"])
    usPlan.save()
    workPlan = WorkoutPlan(workout_id=workout_list, plan_id=usPlan.id)
    workPlan.save()
    return HttpResponseRedirect(django_reverse("base:myPlans", args=[user_id]))

# Create plan view
@login_required
def createPlan(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    user = get_object_or_404(User, pk=user_id)
    workout_list = workoutUser.objects.order_by("-user_id")
    template = loader.get_template("createPlan.html")
    context = {"user": user, "workout_list": workout_list, "user_id": user_id}
    return HttpResponse(template.render(context, request))

# Delete plan view
@login_required
def deletePlan(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    user = get_object_or_404(User, pk=user_id)
    plan_list = userPlan.objects.order_by("-id")
    template = loader.get_template("deletePlan.html")
    context = {"user": user,"plan_list": plan_list , "user_id": user_id}
    return HttpResponse(template.render(context, request))

# Delete plan
@login_required
def delete(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")

    plan_list = request.POST["plan"]
    try:
        usPlan = get_object_or_404(userPlan, pk=plan_list)
    except:
        return HttpResponse("Not valid plan id")
    usPlan.delete()
    return HttpResponseRedirect(django_reverse("base:myPlans", args=[user_id]))

def createWorkout(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")
    
    baseWorkout_list = Workouts.objects.order_by("-id")
    template = loader.get_template("createWorkout.html")
    context= {"user": user, "baseWorkout_list": baseWorkout_list, "user_id": user_id}
    return HttpResponse(template.render(context, request))
    
def createWork(request, user_id):

    userh = User.objects.get(pk=user_id)

    workoutr = request.POST["workouts"]
    workouti = int(workoutr)

    workouth = Workouts.objects.get(pk=workouti)
    
    tim = request.POST["textfield"]
    timeh = int(tim)

        
    usWork = workoutUser(time=timeh , user = userh , title = request.POST["title"], workout = workouth)
    usWork.save()
    return HttpResponseRedirect(django_reverse("base:myPlans", args=[user_id]))
    #return HttpResponse(usWork)
    
def deleteWorkout(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")
    
    workoutList = workoutUser.objects.order_by("-id")
    template = loader.get_template("deleteWorkout.html")
    context = {"user": user,"workoutList" : workoutList, "user_id": user_id}
    return HttpResponse(template.render(context, request))
    
def deleteWork(request, user_id):
    try:
        user = get_object_or_404(User, pk=user_id)
    except:
        return HttpResponse("Not valid user id")
    
    workout = request.POST["workout"]
    try:
        usWork = get_object_or_404(workoutUser, pk=workout)
    except:
        return HttpResponse("Not valid plan id")
    
    usWork.delete()
    return HttpResponseRedirect(django_reverse("base:myPlans", args=[user_id]))