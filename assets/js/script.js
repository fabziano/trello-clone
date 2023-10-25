'use strict'

// ALTERA PLANO DE FUNDO 

const PlanoDeFundo = document.querySelector('body');


if (localStorage.hasOwnProperty('corSelecionada')) {
  const corSelecionada = localStorage.getItem('corSelecionada');
  seletor.value = corSelecionada;
  PlanoDeFundo.style.backgroundColor = corSelecionada;
}

seletor.addEventListener('input', () => {
  const corEscolhida = seletor.value;
  PlanoDeFundo.style.backgroundColor = corEscolhida;
  localStorage.setItem('corSelecionada', corEscolhida);
});

// FIM DO ALTERA PLANO DE FUNDO // 

function addToColumn(columnId) {
  // Obtenha os valores do título e descrição da tarefa
  var title = document.getElementById(columnId + "Title").value;
  var task = document.getElementById(columnId + "Task").value;

  if (title.trim() === "" || task.trim() === "") {
      alert("Preencha título e descrição!");
  } else {
      // Crie um novo elemento de lista (tarefa)
      var listItem = document.createElement("li");
      listItem.draggable = true;

      // Use Date.now() como o ID da tarefa
      var taskId = Date.now();

      // Adicione o ID como um atributo de dados
      listItem.setAttribute('data-task-id', taskId);
      
      // Conteúdo da tarefa
      listItem.innerHTML = `<strong>${title}:</strong><br>${task}<br>
          <button class="remove-btn"><i class="bi bi-trash"></i> Remover</button>
          <button class="edit-btn"><i class="bi bi-pencil-square"></i> Editar</button>`;

      // Adicione a função drag ao elemento
      listItem.addEventListener('dragstart', drag);

      // Adicione a tarefa à lista da coluna correspondente
      document.getElementById(columnId + "List").appendChild(listItem);

      // Limpe os campos após adicionar a tarefa
      document.getElementById(columnId + "Title").value = "";
      document.getElementById(columnId + "Task").value = "";

      // Salve as tarefas no Local Storage
      saveTasks();
  }
}

function saveTasks() {
  // Obtenha todas as tarefas e salve-as no Local Storage
  var todoTasks = document.getElementById("todoList").innerHTML;
  var inProgressTasks = document.getElementById("inProgressList").innerHTML;
  var doneTasks = document.getElementById("doneList").innerHTML;

  localStorage.setItem("todoTasks", todoTasks);
  localStorage.setItem("inProgressTasks", inProgressTasks);
  localStorage.setItem("doneTasks", doneTasks);
}

function removeTask(taskItem, taskId) {
  // Obtenha o ID da tarefa a partir do atributo de dados
  var taskId = taskItem.getAttribute('data-task-id');

  // Remova a tarefa do DOM
  taskItem.remove();

  // Salve as alterações no Local Storage
  saveTasks();
}

function editTask(taskItem, taskId) {
  // Obtenha o ID da tarefa a partir do atributo de dados
  var taskId = taskItem.getAttribute('data-task-id');

  // Obtenha o título e a descrição atuais da tarefa
  var currentTitle = taskItem.querySelector('strong').innerText.replace(':', '');
  var currentTask = taskItem.childNodes[2].nodeValue.trim();

  // Pergunte ao usuário pelos novos título e descrição
  var newTitle = prompt('Editar título:', currentTitle);
  var newTask = prompt('Editar descrição:', currentTask);

  // Atualize a tarefa se os novos títulos e descrição não forem nulos
  if (newTitle !== null && newTask !== null) {
      taskItem.innerHTML = `<strong>${newTitle}:</strong><br>${newTask}<br>
          <button class="remove-btn"><i class="bi bi-trash"></i> Remover</button>
          <button class="edit-btn"><i class="bi bi-pencil-square"></i> Editar</button>`;

      // Adicione novamente os eventos de edição e remoção
      var editButton = taskItem.querySelector('.edit-btn');
      editButton.addEventListener('click', function() {
          editTask(taskItem);
      });

      var removeButton = taskItem.querySelector('.remove-btn');
      removeButton.addEventListener('click', function() {
          if (confirm('Tem certeza de que deseja remover esta tarefa?')) {
              removeTask(taskItem);
          }
      });

      // Salve as alterações no Local Storage
      saveTasks();
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  // Obtém o ID da tarefa e define os dados para a operação de arrastar
  var taskId = ev.target.getAttribute("data-task-id");
  ev.dataTransfer.setData("text/plain", taskId);
}

function drop(ev, columnId) {
  ev.preventDefault();
  var taskId = ev.dataTransfer.getData("text/plain");
  var taskItem = document.querySelector(`[data-task-id="${taskId}"]`);

  // Move a tarefa para a coluna correspondente
  document.getElementById(columnId + "List").appendChild(taskItem);

  // Atualize o Local Storage após a movimentação da tarefa
  saveTasks();
}


function loadTasks() {
  // Recupere as tarefas e as IDs do Local Storage
  var todoTasks = localStorage.getItem("todoTasks") || "";
  var inProgressTasks = localStorage.getItem("inProgressTasks") || "";
  var doneTasks = localStorage.getItem("doneTasks") || "";
  var taskIds = JSON.parse(localStorage.getItem("taskIds")) || [];

  // Defina o conteúdo das listas de tarefas
  document.getElementById("todoList").innerHTML = todoTasks;
  document.getElementById("inProgressList").innerHTML = inProgressTasks;
  document.getElementById("doneList").innerHTML = doneTasks;

  // Adicione a função de arrastar às tarefas
  var taskItems = document.querySelectorAll('[draggable="true"]');
  taskItems.forEach(function (taskItem, index) {
    taskItem.addEventListener("dragstart", drag);
    // Adicione o ID da tarefa como um atributo de dados
    taskItem.setAttribute("data-task-id", taskIds[index]);
  });

  // Adicione a função de editar às tarefas
  var editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var taskItem = button.parentElement;
      var taskId = taskItem.getAttribute("data-task-id");
      editTask(taskItem, taskId);
    });
  });

  // Adicione a função de remover às tarefas
  var removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var taskItem = button.parentElement;
      var taskId = taskItem.getAttribute("data-task-id");
      if (confirm("Tem certeza de que deseja remover esta tarefa?")) {
        removeTask(taskItem, taskId);
      }
    });
  });


  var taskItems = document.querySelectorAll('[draggable="true"]');
  taskItems.forEach(function(taskItem) {
      taskItem.addEventListener('dragstart', drag);
  });
}

window.onload = function() {
  loadTasks();
};
