from django.shortcuts import render, redirect
from django.db.models import Count
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import CreateUserForm
from .decorators import unauthenticated_user
from django.http import JsonResponse,  HttpResponseBadRequest, HttpResponse
from django.db.models import Avg
import datetime
from calendar import monthrange


@unauthenticated_user
def registerPage(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')

            messages.success(request, 'Account was created for ' + username)

            return redirect('login')

    context = {'form': form}
    return render(request, 'leafapp/register.html', context)


@unauthenticated_user
def loginPage(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.info(request, 'Username OR password is incorrect')

    context = {}
    return render(request, 'leafapp/login.html', context)


def logoutUser(request):
    logout(request)
    return redirect('login')


@login_required(login_url='login')
def home(request):
    return render(request, 'leafapp/dashboard.html')


def description(request):
    return render(request, 'leafapp/description.html')


def manual(request):
    return render(request, 'leafapp/manual.html')


def get_last_temperature_reading(request):

    if request.method == 'GET':
        reading = Temperature.objects.last()
        print(reading)
    return JsonResponse({ 'value':reading.value, 'timestamp': reading.timestamp}, safe=False)


def get_temperature_reading(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            current_data = list()
            timestamp_data = list()

            #
            #   Day
            #
            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                monitor = Temperature.objects.filter(timestamp__range=(start_date, end_date)).order_by('timestamp')

                for m in monitor:
                    current_data.append(m.value)
                    timestamp_data.append(m.timestamp)


            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                print(date)

                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Temperature.objects.filter(timestamp__date=date).aggregate(average=Avg('value'))

                    if monitor['average'] is None:
                        monitor['average'] = 0.0

                    current_data.append(monitor['average'])
                    timestamp_data.append(date)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Temperature.objects.filter(timestamp__month=date.month, timestamp__year=date.year).aggregate(average=Avg('value'))

                    if monitor['average'] is None:
                        monitor['average'] = 0.0

                    current_data.append(monitor['average'])
                    timestamp_data.append(date)

            return JsonResponse({'temperature': current_data, 'timestamp': timestamp_data}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))

def save_data(request):
    if request.method == 'GET':
        try:
            value = request.GET.get('value')
            deficiency = request.GET.get('deficiency')
            variety = request.GET.get('variety')
            location = request.GET.get('location')

            monitor = Monitor.objects.create(value = value, deficiency = deficiency, variety = variety, location = location)

            return HttpResponse('Saved')

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def save_temp(request):
    if request.method == 'GET':
        try:
            value = request.GET.get('value')

            monitor = Temperature.objects.create(value = value)

            return HttpResponse('Saved')

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def arabica_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)
                data_phosphorus = 0
                data_potassium = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Phosphorus')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Potassium')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Phosphorus')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Potassium')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_potassium = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Phosphorus').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Potassium').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def robusta_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Phosphorus')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Potassium')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Calcium')\
                    .aggregate(total=Count('value'))

                data_calcium = data_calcium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Boron') \
                    .aggregate(total=Count('value'))

                data_boron = data_boron + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Iron') \
                    .aggregate(total=Count('value'))

                data_iron = data_iron + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Magnesium') \
                    .aggregate(total=Count('value'))

                data_magnesium = data_magnesium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Nitrogen') \
                    .aggregate(total=Count('value'))

                data_nitrogen = data_nitrogen + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Zinc') \
                    .aggregate(total=Count('value'))

                data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Phosphorus')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Potassium')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Calcium')\
                        .aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Boron') \
                        .aggregate(total=Count('value'))

                    data_boron = data_boron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Iron') \
                        .aggregate(total=Count('value'))

                    data_iron = data_iron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Magnesium') \
                        .aggregate(total=Count('value'))

                    data_magnesium = data_magnesium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Nitrogen') \
                        .aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Zinc') \
                        .aggregate(total=Count('value'))

                    data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Phosphorus').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Potassium').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Calcium').aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Boron').aggregate(total=Count('value'))

                    data_boron = data_boron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Iron').aggregate(total=Count('value'))

                    data_iron = data_iron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Magnesium').aggregate(total=Count('value'))

                    data_magnesium = data_magnesium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Nitrogen').aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Zinc').aggregate(total=Count('value'))

                    data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def liberica_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_nitrogen = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Liberica',
                                                                              deficiency='Phosphorus')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Liberica',
                                                                              deficiency='Nitrogen')\
                    .aggregate(total=Count('value'))

                data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_nitrogen = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Liberica',
                                                                                  deficiency='Phosphorus')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Liberica',
                                                                                  deficiency='Nitrogen')\
                        .aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_nitrogen = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Liberica',deficiency='Phosphorus').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Liberica',deficiency='Nitrogen').aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def excela_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Phosphorus')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Potassium')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Calcium')\
                    .aggregate(total=Count('value'))

                data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Phosphorus')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Potassium')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Calcium')\
                        .aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_potassium=0
                data_calcium = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Phosphorus').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Potassium').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Calcium').aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def amadeo_arabica_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)
                data_phosphorus = 0
                data_potassium = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Phosphorus', location='Amadeo')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])
                print(int(monitor["total"]))
                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Potassium',location='Amadeo')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])
                print(int(monitor["total"]))
                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Phosphorus',location ='Amadeo')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Potassium',location ='Amadeo')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_potassium = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Phosphorus',location ='Amadeo').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Potassium',location ='Amadeo').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def indang_arabica_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)
                data_phosphorus = 0
                data_potassium = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Phosphorus', location='Indang')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])
                print(int(monitor["total"]))
                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Arabica',
                                                                              deficiency='Potassium',location='Indang')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])
                print(int(monitor["total"]))
                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Phosphorus',location ='Indang')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Arabica',
                                                                                  deficiency='Potassium',location ='Indang')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_potassium = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Phosphorus',location ='Indang').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Arabica',deficiency='Potassium',location ='Indang').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium]}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def indang_robusta_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Phosphorus', location = 'Indang')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Potassium', location = 'Indang')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                              deficiency='Calcium', location = 'Indang')\
                    .aggregate(total=Count('value'))

                data_calcium = data_calcium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Boron', location = 'Indang') \
                    .aggregate(total=Count('value'))

                data_boron = data_boron + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Iron', location = 'Indang') \
                    .aggregate(total=Count('value'))

                data_iron = data_iron + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Magnesium', location = 'Indang') \
                    .aggregate(total=Count('value'))

                data_magnesium = data_magnesium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Nitrogen', location = 'Indang') \
                    .aggregate(total=Count('value'))

                data_nitrogen = data_nitrogen + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Robusta',
                                                                                                 deficiency='Zinc', location = 'Indang') \
                    .aggregate(total=Count('value'))

                data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Phosphorus', location = 'Indang')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Potassium', location = 'Indang')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Calcium', location = 'Indang')\
                        .aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Boron', location = 'Indang') \
                        .aggregate(total=Count('value'))

                    data_boron = data_boron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Iron', location = 'Indang') \
                        .aggregate(total=Count('value'))

                    data_iron = data_iron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Magnesium', location = 'Indang') \
                        .aggregate(total=Count('value'))

                    data_magnesium = data_magnesium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Nitrogen', location = 'Indang') \
                        .aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Robusta',
                                                                                  deficiency='Zinc', location = 'Indang') \
                        .aggregate(total=Count('value'))

                    data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                data_boron = 0
                data_iron = 0
                data_magnesium = 0
                data_nitrogen = 0
                data_zinc = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Phosphorus', location = 'Indang').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Potassium', location = 'Indang').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Calcium', location = 'Indang').aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Boron', location = 'Indang').aggregate(total=Count('value'))

                    data_boron = data_boron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Iron', location = 'Indang').aggregate(total=Count('value'))

                    data_iron = data_iron + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta',deficiency='Magnesium', location = 'Indang').aggregate(total=Count('value'))

                    data_magnesium = data_magnesium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Nitrogen', location = 'Indang').aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Robusta', deficiency='Zinc', location = 'Indang').aggregate(total=Count('value'))

                    data_zinc = data_zinc + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],
                                     'deficiency4': ['Boron', data_boron],
                                     'deficiency5': ['Iron', data_iron],
                                     'deficiency6': ['Magnesium', data_magnesium],
                                     'deficiency7': ['Nitrogen', data_nitrogen],
                                     'deficiency8': ['Zinc', data_zinc],
                                     }, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def indang_liberica_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_nitrogen = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Liberica',
                                                                              deficiency='Phosphorus', location ='Indang')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Liberica',
                                                                              deficiency='Nitrogen', location ='Indang')\
                    .aggregate(total=Count('value'))

                data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_nitrogen = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Liberica',
                                                                                  deficiency='Phosphorus', location ='Indang')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Liberica',
                                                                                  deficiency='Nitrogen', location ='Indang')\
                        .aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_nitrogen = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Liberica',deficiency='Phosphorus', location ='Indang').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Liberica',deficiency='Nitrogen', location ='Indang').aggregate(total=Count('value'))

                    data_nitrogen = data_nitrogen + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Nitrogen', data_nitrogen]}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def amadeo_excela_variety(request):

    if request.method == 'GET':

        try:
            mode = request.GET.get('mode')
            datepicker = request.GET.get('datepicker').replace('-', '')
            br_timezone = request.GET.get('timezone')

            #
            #   Day
            #

            if mode == 'day':
                start_date = datetime.datetime.strptime(datepicker + br_timezone, '%m%d%Y%z')
                end_date = start_date.replace(hour=23, minute=59, second=59)

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Phosphorus', location= 'Amadeo')\
                    .aggregate(total=Count('value'))

                data_phosphorus = data_phosphorus + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Potassium', location= 'Amadeo')\
                    .aggregate(total=Count('value'))

                data_potassium = data_potassium + int(monitor["total"])

                monitor = Monitor.objects.filter(timestamp__range=(start_date, end_date)).filter(variety='Excela',
                                                                              deficiency='Calcium', location= 'Amadeo')\
                    .aggregate(total=Count('value'))

                data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)

            #
            #   Month
            #
            elif mode == 'month':
                date = datetime.datetime.strptime(datepicker + br_timezone, '%m%Y%z')
                last_day = monthrange(int(date.year), int(date.month))[1]

                data_phosphorus = 0
                data_potassium = 0
                data_calcium = 0
                for n in range(0, last_day):

                    date = date.replace(day = n+1)

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Phosphorus', location= 'Amadeo')\
                        .aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Potassium', location= 'Amadeo')\
                        .aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__date=date).filter(variety='Excela',
                                                                                  deficiency='Calcium', location= 'Amadeo')\
                        .aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)
            #
            #   Year
            #
            elif mode == 'year':

                date = datetime.datetime.strptime(datepicker + br_timezone, '%Y%z')
                data_phosphorus = 0
                data_potassium=0
                data_calcium = 0

                for n in range(0, 12):

                    date = date.replace(month=n+1)

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Phosphorus', location= 'Amadeo').aggregate(total=Count('value'))

                    data_phosphorus = data_phosphorus + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Potassium', location= 'Amadeo').aggregate(total=Count('value'))

                    data_potassium = data_potassium + int(monitor["total"])

                    monitor = Monitor.objects.filter(timestamp__month=date.month, timestamp__year=date.year)\
                        .filter(variety='Excela',deficiency='Calcium', location= 'Amadeo').aggregate(total=Count('value'))

                    data_calcium = data_calcium + int(monitor["total"])

                return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                     'deficiency2': ['Potassium', data_potassium],
                                     'deficiency3': ['Calcium', data_calcium],}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def amadeo_variety(request):

    if request.method == 'GET':

        try:

            data_phosphorus = 0
            data_potassium = 0
            data_calcium = 0

            monitor = Monitor.objects.filter(deficiency='Phosphorus',location= 'Amadeo').aggregate(total=Count('value'))

            data_phosphorus = data_phosphorus + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Potassium',location= 'Amadeo').aggregate(total=Count('value'))

            data_potassium = data_potassium + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Calcium',location= 'Amadeo').aggregate(total=Count('value'))

            data_calcium = data_calcium + int(monitor["total"])

            return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                 'deficiency2': ['Potassium', data_potassium],
                                 'deficiency3': ['Calcium', data_calcium],}, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def indang_variety(request):

    if request.method == 'GET':

        try:

            data_phosphorus = 0
            data_potassium = 0
            data_calcium = 0
            data_boron = 0
            data_iron = 0
            data_magnesium = 0
            data_nitrogen = 0
            data_zinc = 0

            monitor = Monitor.objects.filter(deficiency='Phosphorus',location = 'Indang').aggregate(total=Count('value'))

            data_phosphorus = data_phosphorus + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Potassium',location = 'Indang').aggregate(total=Count('value'))

            data_potassium = data_potassium + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Calcium',location = 'Indang').aggregate(total=Count('value'))

            data_calcium = data_calcium + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Boron',location = 'Indang').aggregate(total=Count('value'))

            data_boron = data_boron + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Iron',location = 'Indang').aggregate(total=Count('value'))

            data_iron = data_iron + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Magnesium',location = 'Indang').aggregate(total=Count('value'))

            data_magnesium = data_magnesium + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Nitrogen',location = 'Indang').aggregate(total=Count('value'))

            data_nitrogen = data_nitrogen + int(monitor["total"])

            monitor = Monitor.objects.filter(deficiency='Zinc',location = 'Indang').aggregate(total=Count('value'))

            data_zinc = data_zinc + int(monitor["total"])

            return JsonResponse({'deficiency1': ['Phosphorus', data_phosphorus],
                                 'deficiency2': ['Potassium', data_potassium],
                                 'deficiency3': ['Calcium', data_calcium],
                                 'deficiency4': ['Boron', data_boron],
                                 'deficiency5': ['Iron', data_iron],
                                 'deficiency6': ['Magnesium', data_magnesium],
                                 'deficiency7': ['Nitrogen', data_nitrogen],
                                 'deficiency8': ['Zinc', data_zinc],
                                 }, safe=False)

        except Exception as e:
            return HttpResponseBadRequest(str(e))


def table_arabica(request):
    if request.method == 'GET':

        total_phosphorus = 0
        total_potassium = 0
        amadeo_phosphorus = 0
        amadeo_potassium = 0
        indang_phosphorus = 0
        indang_potassium = 0

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Phosphorus') \
            .aggregate(total=Count('value'))

        total_phosphorus = total_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Potassium') \
            .aggregate(total=Count('value'))

        total_potassium = total_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Phosphorus',location='Amadeo') \
            .aggregate(total=Count('value'))

        amadeo_phosphorus = amadeo_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Potassium',location='Amadeo') \
            .aggregate(total=Count('value'))

        amadeo_potassium = amadeo_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Phosphorus',location='Indang') \
            .aggregate(total=Count('value'))

        indang_phosphorus = indang_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Arabica',deficiency='Potassium',location='Indang') \
            .aggregate(total=Count('value'))

        indang_potassium = indang_potassium + int(monitor["total"])

        return JsonResponse({'total_phos': [total_phosphorus],
                             'total_pot':  [total_potassium],
                             'amadeo_phos':  [amadeo_phosphorus],
                             'amadeo_pot':  [amadeo_potassium],
                             'indang_phos':  [indang_phosphorus],
                             'indang_pot':  [indang_potassium],}, safe=False)


def table_robusta(request):
    if request.method == 'GET':
        total_phosphorus = 0
        total_potassium = 0
        total_calcium = 0
        total_boron = 0
        total_iron = 0
        total_magnesium = 0
        total_nitrogen = 0
        total_zinc = 0

        indang_phosphorus = 0
        indang_potassium = 0
        indang_calcium = 0
        indang_boron = 0
        indang_iron = 0
        indang_magnesium = 0
        indang_nitrogen = 0
        indang_zinc = 0

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Phosphorus',location='Indang').aggregate(total=Count('value'))

        total_phosphorus = total_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Potassium',location='Indang').aggregate(total=Count('value'))

        total_potassium =  total_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Calcium',location='Indang').aggregate(total=Count('value'))

        total_calcium = total_calcium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Boron',location='Indang').aggregate(total=Count('value'))

        total_boron = total_boron + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Iron',location='Indang').aggregate(total=Count('value'))

        total_iron = total_iron + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Magnesium',location='Indang').aggregate(total=Count('value'))

        total_magnesium = total_magnesium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Nitrogen',location='Indang').aggregate(total=Count('value'))

        total_nitrogen = total_nitrogen + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Zinc',location='Indang').aggregate(total=Count('value'))

        total_zinc = total_zinc + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Phosphorus',location='Indang').aggregate(total=Count('value'))

        indang_phosphorus = indang_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Potassium', location='Indang').aggregate(total=Count('value'))

        indang_potassium =  indang_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Calcium', location='Indang').aggregate(total=Count('value'))

        indang_calcium = indang_calcium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Boron', location='Indang').aggregate(total=Count('value'))

        indang_boron = indang_boron + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Iron', location='Indang').aggregate(total=Count('value'))

        indang_iron = indang_iron + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Magnesium', location='Indang').aggregate(total=Count('value'))

        indang_magnesium = indang_magnesium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Nitrogen', location='Indang').aggregate(total=Count('value'))

        indang_nitrogen = indang_nitrogen + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Robusta',deficiency='Zinc', location='Indang').aggregate(total=Count('value'))

        indang_zinc = indang_zinc + int(monitor["total"])

        return JsonResponse({'total_phos': [total_phosphorus],
                             'total_pot': [total_potassium],
                             'total_calcium': [total_calcium],
                             'total_boron': [total_boron],
                             'total_iron': [total_iron],
                             'total_magnesium': [total_magnesium],
                             'total_nitrogen': [total_nitrogen],
                             'total_zinc': [total_zinc],
                             'indang_phos': [indang_phosphorus],
                             'indang_pot': [indang_potassium],
                             'indang_calcium': [indang_calcium],
                             'indang_boron': [indang_boron],
                             'indang_iron': [indang_iron],
                             'indang_magnesium': [indang_magnesium],
                             'indang_nitrogen': [indang_nitrogen],
                             'indang_zinc': [indang_zinc],
                             }, safe=False)


def table_liberica(request):
    if request.method == 'GET':

        total_phosphorus = 0
        total_nitrogen = 0
        indang_phosphorus = 0
        indang_nitrogen = 0

        monitor = Monitor.objects.filter(variety='Liberica',deficiency='Phosphorus',location='Indang') \
            .aggregate(total=Count('value'))

        total_phosphorus = total_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Liberica',deficiency='Nitrogen',location='Indang') \
            .aggregate(total=Count('value'))

        total_nitrogen = total_nitrogen + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Liberica',deficiency='Phosphorus',location='Indang') \
            .aggregate(total=Count('value'))

        indang_phosphorus = indang_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Liberica',deficiency='Nitrogen',location='Indang') \
            .aggregate(total=Count('value'))

        indang_nitrogen = indang_nitrogen + int(monitor["total"])

        return JsonResponse({'total_phos': [total_phosphorus],
                             'total_nit':  [total_nitrogen],
                             'indang_phos':  [indang_phosphorus],
                             'indang_nit':  [indang_nitrogen],}, safe=False)


def table_excela(request):
    if request.method == 'GET':

        total_phosphorus = 0
        total_potassium = 0
        total_calcium = 0
        amadeo_phosphorus = 0
        amadeo_potassium = 0
        amadeo_calcium = 0

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Phosphorus',location='Amadeo') \
            .aggregate(total=Count('value'))

        total_phosphorus = total_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Potassium',location='Amadeo') \
            .aggregate(total=Count('value'))

        total_potassium = total_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Calcium',location='Amadeo') \
            .aggregate(total=Count('value'))

        total_calcium = total_calcium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Phosphorus',location='Amadeo') \
            .aggregate(total=Count('value'))

        amadeo_phosphorus = amadeo_phosphorus + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Potassium',location='Amadeo') \
            .aggregate(total=Count('value'))

        amadeo_potassium= amadeo_potassium + int(monitor["total"])

        monitor = Monitor.objects.filter(variety='Excela',deficiency='Calcium',location='Amadeo') \
            .aggregate(total=Count('value'))

        amadeo_calcium= amadeo_calcium + int(monitor["total"])

        return JsonResponse({'total_phos': [total_phosphorus],
                             'total_pot':  [total_potassium],
                             'total_calcium':  [total_calcium],
                             'amadeo_phos': [amadeo_phosphorus],
                             'amadeo_pot': [amadeo_potassium],
                             'amadeo_calcium': [amadeo_calcium],
                             }, safe=False)






