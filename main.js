window.onload = displayData;
let editId = '';
const getErrorId = document.getElementById('error-msg');
const dateInput = document.forms[0].employeeBirthday;
dateInput.max = new Date().toISOString().split('T')[0];

document.getElementById('submitButton').addEventListener('click', function (e) {
  e.preventDefault();
  getErrorId.innerHTML = '';
  //------------------------get Name & validations----------------------------------------
  const empName = document.forms[0].employeeName.value;
  let errorMessage = '';
  if (empName === '') {
    errorMessage = 'Please enter a name.';
  } else if (empName.length < 4 || empName.length > 20) {
    errorMessage = 'Name field should be between 4 to 20 characters.';
  } else if (!empName.match(/^[A-Za-z]+$/)) {
    errorMessage = 'Name field including only alphanumeric characters.';
  }
  if (errorMessage) {
    getErrorId.innerHTML = errorMessage;
    document.forms[0].employeeName.focus();
    return false;
  }
  //------------------------get birth date & validations----------------------------------------
  const empBirthday = document.forms[0].employeeBirthday.value;
  errorMessage = '';
  if (empBirthday === '') {
    errorMessage = 'Please enter your birthDate.';
  }
  if (errorMessage) {
    getErrorId.innerHTML = errorMessage;
    document.forms[0].employeeBirthday.focus();
    return false;
  }

  //------------------------get Email & validations----------------------------------------
  const empEmail = document.forms[0].employeeEmail.value;
  if (empEmail === '') {
    errorMessage = 'Please enter your mail.';
  } else if (!empEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    errorMessage = 'You have entered an invalid email address!';
  }
  if (errorMessage) {
    getErrorId.innerHTML = errorMessage;
    document.forms[0].employeeEmail.focus();
    return false;
  }

  //------------------------get Phone no. & validations----------------------------------------
  const empPhoneNo = document.forms[0].employeePhoneNo.value;
  if (empPhoneNo === '') {
    errorMessage = 'Please enter your phone Number.';
  } else if (isNaN(empPhoneNo)) {
    errorMessage = 'Your Phone number contains digits only.';
  } else if (empPhoneNo.length != 10) {
    errorMessage = 'Phone number contains 10 digits.';
  }
  if (errorMessage) {
    getErrorId.innerHTML = errorMessage;
    document.forms[0].employeePhoneNo.focus();
    return false;
  }
  //-----------to get selected value of check box---------------------------
  const selectedHobbies = [];
  const hobbyInputs = document.forms[0].employeeHobby;

  for (let i = 0; i < hobbyInputs.length; i++) {
    if (hobbyInputs[i].checked) {
      selectedHobbies.push(hobbyInputs[i].value);
    }
  }

  let selectedGender;
  const genderInputs = document.forms[0].employeeGender;

  for (let i = 0; i < genderInputs.length; i++) {
    if (genderInputs[i].checked) {
      selectedGender = genderInputs[i].value;
      break;
    }
  }

  if (editId) {
    const employeeUpdated = {
      Name: empName,
      Gender: selectedGender,
      BirthDate: empBirthday,
      Email: empEmail,
      PhoneNumber: empPhoneNo,
      Hobby: selectedHobbies,
    };
    updateRow(employeeUpdated, editId);
  } else {
    const employee = {
      UniqueId: uniqueIdGenerator(),
      Name: empName,
      Gender: selectedGender,
      BirthDate: empBirthday,
      Email: empEmail,
      PhoneNumber: empPhoneNo,
      Hobby: selectedHobbies,
    };
    addData(employee);
  }
});
/*------------------------get data from the local storage-----------------------*/
function getDataFromLocalStorage() {
  const storageData = JSON.parse(localStorage.getItem('emp_obj')) || [];
  return storageData;
}
/*------------------------set data in local storage-----------------------*/
function setDataInLocalStorage(setInLocalStorage) {
  localStorage.setItem('emp_obj', JSON.stringify(setInLocalStorage));
}

/*------------------------For storing data in local storage-----------------------*/

function addData(employee) {
  const existingData = getDataFromLocalStorage();
  //For duplication of mail
  const empEmail = document.forms[0].employeeEmail.value;

  if (existingData.some((emp) => emp.Email === empEmail)) {
    getErrorId.innerHTML = 'This email is already in use. Please enter a valid email.';
    document.forms[0].employeeEmail.focus();
    return false;
  }
  //store data in local storage
  const finalData = existingData.concat(employee);
  setDataInLocalStorage(finalData);

  const getTblIdBasic = document.getElementById('basicTableId');
  addRowInBasicTable(getTblIdBasic, employee);

  const getTblIdAdvance = document.getElementById('advanceTableId');
  addInAdvanceTable(getTblIdAdvance);

  clearForm();
}

/*------------------------For display the data in table format (Basic & advance format)-----------------------*/
function displayData() {
  const basicTableHeading = document.createElement('h1');
  const basicTableHeadingText = document.createTextNode('Basic Table');
  basicTableHeading.appendChild(basicTableHeadingText);
  basicTableHeading.style.textAlign = 'center';
  document.body.appendChild(basicTableHeading);

  const basicTable = document.createElement('table');
  basicTable.setAttribute('id', 'basicTableId');
  styleTheTable(basicTable);

  const headers = ['UniqueId', 'Name', 'Gender', 'Date of Birth', 'E-mail', 'Mobile Number', 'Hobbies'];

  headers.forEach((element) => {
    const heading = document.createElement('th');
    const headingIdText = document.createTextNode(element);
    heading.appendChild(headingIdText);
    styleOfTableHeader(heading);
    basicTable.appendChild(heading);
  });

  const existingData = getDataFromLocalStorage();

  existingData.forEach((rowData) => {
    addRowInBasicTable(basicTable, rowData);
  });
  document.body.appendChild(basicTable);

  //ADVANCE TABLE

  const advanceTableHeading = document.createElement('h1');
  const advanceTableHeadingText = document.createTextNode('Advance Table');
  advanceTableHeading.appendChild(advanceTableHeadingText);
  advanceTableHeading.style.textAlign = 'center';
  document.body.appendChild(advanceTableHeading);

  const advanceTable = document.createElement('table');
  advanceTable.setAttribute('id', 'advanceTableId');
  styleTheTable(advanceTable);

  addInAdvanceTable(advanceTable);

  document.body.appendChild(advanceTable);
}

//----------------------------Add data in advanced table-------------------------------------
function addInAdvanceTable(advanceTable) {
  advanceTable.innerHTML = '';
  // Create data columns
  const existingData = getDataFromLocalStorage();
  const dataRows = [];
  existingData.forEach((rowData) => {
    for (const key in rowData) {
      if (!dataRows[key]) {
        dataRows[key] = advanceTable.insertRow(-1);
        const headerCell = document.createElement('th');
        headerCell.appendChild(document.createTextNode(key));
        dataRows[key].appendChild(headerCell);
        styleOfTableHeader(headerCell);
      }
      const cell = dataRows[key].insertCell();
      cell.innerHTML = rowData[key];
      cell.style.padding = '5px';
      cell.style.backgroundColor = '#f2f2f2';
    }
  });

  // Create buttons row
  const buttonsRow = advanceTable.insertRow(-1);
  const cellFirst = buttonsRow.insertCell();
  cellFirst.innerHTML = ' ';
  existingData.forEach((rowData) => {
    // Add empty cell for each column
    if (rowData) {
      const emptyCell = buttonsRow.insertCell();
      // Add UPDATE button in ADVANCE table
      updateButtonInTable(emptyCell, rowData);

      // Add DELETE button in ADVANCE table
      deleteButtonInTable(emptyCell, rowData);
    }
  });
}

//-------------------------ADD NEW ROW DATA IN BASIC TABLE------------------------------------------
function addRowInBasicTable(basicTable, rowData) {
  if (rowData) {
    const newRow = basicTable.insertRow(-1);
    for (const key in rowData) {
      const cell = newRow.insertCell();
      cell.innerHTML = rowData[key];
      cell.style.padding = '5px';
      cell.style.backgroundColor = '#f2f2f2';
    }
    //delete button in BASIC table
    deleteButtonInTable(newRow, rowData);
    //update button in BASIC table
    updateButtonInTable(newRow, rowData);
  }
}
//-------------------------FOR UNIQUE ID-GENERATOR----------------------------
function uniqueIdGenerator(length = 16) {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '')
  );
}
//------------------------DELETE FUNCTION----------------------------
function deleteRow(employeeId) {
  let existingData = getDataFromLocalStorage();
  const indexToDelete = existingData.findIndex((element) => element.UniqueId === employeeId);
  //delete data in basic table
  if (indexToDelete !== -1) {
    existingData = existingData.filter((element) => element.UniqueId !== employeeId);
    setDataInLocalStorage(existingData);
    const bscTable = document.getElementById('basicTableId');
    const rows = bscTable.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].cells[0].innerHTML == employeeId) {
        bscTable.deleteRow(i);
        break;
      }
    }
    //delete data in advance table
    const allRows = document.getElementById('advanceTableId').rows;
    for (let i = 0; i < allRows.length; i++) {
      if (allRows[i].cells.length > 1) {
        allRows[i].deleteCell(indexToDelete + 1);
      }
    }
  } else alert('No such record found!');
  clearForm();
}

//-------------------------UPDATE FORM---------------------------------------
function updateForm(employeeId) {
  const existingData = getDataFromLocalStorage();
  const empToUpdate = existingData.find((element) => element.UniqueId === employeeId);
  if (empToUpdate) {
    editId = empToUpdate.UniqueId;
    document.forms[0].employeeName.value = empToUpdate.Name;
    document.forms[0].employeeGender.value = empToUpdate.Gender;
    document.forms[0].employeeBirthday.value = empToUpdate.BirthDate;
    document.forms[0].employeeEmail.value = empToUpdate.Email;
    document.forms[0].employeePhoneNo.value = empToUpdate.PhoneNumber;
    document.forms[0].employeeHobby.forEach((checkbox) => {
      if (empToUpdate.Hobby.includes(checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  }
}

//-------------------UPDATE FUNCTION----------------------------
function updateRow(employeeUpdated, empToUpdateId) {
  const existingData = getDataFromLocalStorage();
  //email validation
  const indexToUpdate = existingData.findIndex((element) => element.UniqueId === empToUpdateId);

  if (indexToUpdate !== -1) {
    const isDuplicate = existingData.some((email, index) => email === employeeUpdated.Email && index !== indexToUpdate);

    if (isDuplicate) {
      alert('This email is already registered.');
      return;
    }
    //Update the data  in local storage
    existingData[indexToUpdate] = { ...existingData[indexToUpdate], ...employeeUpdated };
    existingData[indexToUpdate].UniqueId = empToUpdateId;
    setDataInLocalStorage(existingData);

    // Get the advance table and update table data
    const idOfTableAdvance = document.getElementById('advanceTableId');
    addInAdvanceTable(idOfTableAdvance);

    const idOfTableBasic = document.getElementById('basicTableId');
    const rows = idOfTableBasic.getElementsByTagName('tr');

    const updateRowData = rows[indexToUpdate];
    if (updateRowData) {
      for (let i = 1; i < updateRowData.cells.length; i++) {
        const cellKey = Object.keys(existingData[indexToUpdate])[i];
        updateRowData.cells[i].innerHTML = existingData[indexToUpdate][cellKey];
      }
      editId = '';
      clearForm();
    }
  }
}
//----------------clear the form----------------------
function clearForm() {
  document.forms[0].reset();
}
//----------------styling of the table----------------------
function styleTheTable(table) {
  table.style.padding = '15px';
  table.style.tableLayout = 'fixed';
  table.style.borderSpacing = '8px';
  table.style.textAlign = 'center';
}
//----------------styling of the table header----------------------
function styleOfTableHeader(stylingTableHeader) {
  stylingTableHeader.style.padding = '15px';
  stylingTableHeader.style.backgroundColor = '#4CAF50';
  stylingTableHeader.style.color = 'white';
}
//------------------Update Button--------------------------
function updateButtonInTable(newRow, rowData) {
  const updateButton = document.createElement('button');
  const updateButtonText = document.createTextNode(' Update');
  updateButton.style.padding = '10px';
  updateButton.style.margin = '2px';
  updateButton.appendChild(updateButtonText);
  newRow.appendChild(updateButton);

  updateButton.onclick = function () {
    updateForm(rowData.UniqueId);
  };
}
//------------------Delete Button--------------------------
function deleteButtonInTable(newRow, rowData) {
  const deleteButton = document.createElement('button');
  const deleteButtonText = document.createTextNode(' Delete');
  deleteButton.style.padding = '10px';
  deleteButton.style.margin = '2px';
  deleteButton.appendChild(deleteButtonText);
  newRow.appendChild(deleteButton);

  deleteButton.onclick = function () {
    deleteRow(rowData.UniqueId);
  };
}
//-----------------------------------------------------------------------------------------------------------------------
