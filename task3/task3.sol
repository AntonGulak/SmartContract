pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract task3 {

     struct TaskList { 
      string name;
      uint32 timestamp;
      bool flag ;
	}


   int8 public iter = 0;

   mapping(int8 => TaskList) TaskListTable;

	
	constructor() public {
		// check that contract's public key is set
		require(tvm.pubkey() != 0, 101);
		// Check that message has signature (msg.pubkey() is not zero) and message is signed with the owner's private key
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();

	}

	// Modifier that allows to accept some external messages
	modifier checkOwnerAndAccept {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tvm.pubkey(), 102);
    
		tvm.accept();
		_;
	}

    //Добавить задачу
    function addTask(string name, bool flag) public checkOwnerAndAccept {
        TaskListTable[iter++] = TaskList(name, now, flag);
	}
    
    //Выдает имя задачи, время создания и состояние выполненности 
    function getDescriptionTask (int8 i) public checkOwnerAndAccept returns (TaskList) {
        require(i < iter, 101, "Выход за границы");   

        return TaskListTable[i] ;  
    }

    //Считать задачу выполненной (обращение по индексу)
    function taskIsDone(int8 i) public checkOwnerAndAccept {
        require(i < iter, 101, "Выход за границы");   

        TaskListTable[i].flag = true;
	}

    //Удаляет задачу по индексу
     function deleteTask(int8 i) public checkOwnerAndAccept {
        require(i < iter, 101, "Выход за границы");   

        delete TaskListTable[i];
	}

    //Выводит количество открытых задач (кроме удаленных)
     function getOpenTask () public checkOwnerAndAccept returns (int8) {
        require(!TaskListTable.empty(), 101, "Задач пока нет");

        int8 amount = 0;

        for (int8 j = 0; j < iter; j++)  {
            if (TaskListTable[j].timestamp != 0 && TaskListTable[j].flag == false )
            {
                amount++;
            }
        } 
        return  amount;  
    }

    //Выводит список номеров задач
    function getTaskList () public checkOwnerAndAccept returns (string) {
        require(!TaskListTable.empty(), 101, "Задач пока нет");

        string temp = "Список задач: ";

        for (int8 j = 0; j < iter; j++)  {
            if (TaskListTable[j].timestamp != 0 )
            {
                temp.append(format("{} ", j));
            }
        } 

        return  temp;  
    }


    } //end_contract

 