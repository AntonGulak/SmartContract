def getCoef(_capabilityArmy, _resources) -> float:
    sum = 0

    for x in range(len(_resources)):
        sum += _resources[x]

    return _capabilityArmy / sum


def getFraction(number)  -> float:
    return number - int(number)


#Сортировка неэффективная, но если что-нибудь впихнуть с n*logn, то заметно прибавим на больших данных
def bubble_sort(_resources):
    # Устанавливаем swapped в True, чтобы цикл запустился хотя бы один раз
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(_resources) - 1):
            if getFraction(_resources[i]) < getFraction(_resources[i + 1]):
                # Меняем элементы
                _resources[i], _resources[i + 1] = _resources[i + 1], _resources[i]
                # Устанавливаем swapped в True для следующей итерации
                swapped = True


#FAIL: [3, 3, 3, 3, 3, 3, 7], 5 --> [1, 1, 1, 1, 0, 0, 0, 1]
if __name__ == '__main__':

    resources = []
    resources = [int(i) for i in input('Enter the values of resources ').split()]

    capabilityArmy = int(input('Enter the carrying capacity of the army '))


    #Получаем  коэффициент распределения
    coef = getCoef(capabilityArmy, resources)

    #Умножаем ресурсы на коэффициент распределения
    for x in range(len(resources)):
        resources[x] = round(resources[x] * coef, 5)

    #print(resources)


    # Аккумулятор для целых частей
    intSum = 0

    for x in range(len(resources)):
        intSum += int(resources[x])

    # Нераспределенная грузоподъемность
    balance = capabilityArmy - intSum


    #Сортируем массив по убыванию дробных частей
    #Оставшиеся места будет определять по дробной части
    bubble_sort(resources)


    for x in range(balance):
        resources[x] = int(resources[x]) + 1

    for x in range(balance, len(resources)):
        resources[x] = int(resources[x])



    print(resources)








