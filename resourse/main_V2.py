
if __name__ == '__main__':

    resources = []
    resources = [int(i) for i in input('Enter the values of resources ').split()]

    original = resources.copy()

    capabilityArmy = int(input('Enter the carrying capacity of the army '))


    #Пустой массив под распределение ресурсов
    distributionResources = [0] * len(resources)

    #Метод Д'Ондта
    for i in range(capabilityArmy):
        max = - 1
        index = -1

        for j in range(len(resources)):
            if resources[j] > max:
                max = resources[j]
                index = j

        distributionResources[index] += 1

        resources[index] = original[index]/(1+distributionResources[index])


    print(distributionResources)








