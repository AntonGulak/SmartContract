
def getCoef(_capabilityArmy, _resources) -> float:
    sum = 0

    for x in range(len(_resources)):
        sum += _resources[x]

    return _capabilityArmy / sum


def getFraction(number)  -> float:
    return number - int(number)


if __name__ == '__main__':

    resources = []
    resources = [int(i) for i in input('Enter the values of resources ').split()]

    original = resources.copy()

    capabilityArmy = int(input('Enter the carrying capacity of the army '))

    sumRex = sum(resources)
    if sumRex < capabilityArmy:
        capabilityArmy = sumRex


    #Получаем  коэффициент распределения
    coef = getCoef(capabilityArmy, resources)

    #Умножаем ресурсы на коэффициент распределения
    for x in range(len(resources)):
        resources[x] = round(resources[x] * coef, 5)


    # Аккумулятор для целых частей
    intSum = 0

    for x in range(len(resources)):
        intSum += int(resources[x])

    # Нераспределенная грузоподъемность
    balance = capabilityArmy - intSum

    # Неиспользованные ресурсы
    resourcesDHondt = [0] * len(original)

    for x in range(len(original)):
        resourcesDHondt[x] = round((original[x] * getFraction(resources[x])) / resources[x])
        resources[x] = int(resources[x])


#______________________________________________________________________________________________________
#Применяем метод Д'Ондта для остаточных ресурсов

    originalDHondt = resourcesDHondt.copy()

    for i in range(balance):
        max = - 1
        index = -1

        for j in range(len(resourcesDHondt)):
            if resourcesDHondt[j] > max:
                max = resourcesDHondt[j]
                index = j

        resources[index] += 1

        resourcesDHondt[index] = originalDHondt[index]/(1+resources[index])


    #print(resourcesDHondt)
    print(resources)
