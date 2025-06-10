
// 
// 
// Для форм

// Замена текста при выборе файла 
let files = document.querySelectorAll('.input-file');
let fileText, fileDefaultText, fileInput, filesNames, fileName;

files.forEach(file => {
	fileText = file.querySelector('.input-file-text');
	fileDefaultText = fileText.textContent;

	const handleFiles = (fileInput, fileText) => {
		filesNames = '';

		for (let i = 0; i < fileInput.files.length; i++) {
			filesNames += fileInput.files[i].name;

			if (i !== fileInput.files.length - 1) {
				filesNames += ', ';
			}
		}

		fileName = fileInput.value.split('\\').pop();
		fileText.textContent = fileName ? filesNames : fileDefaultText;
	};

	file.querySelector('input').addEventListener('change', function () {
		handleFiles(this, fileText);
	});

	file.addEventListener('dragover', (e) => {
		e.preventDefault();
		file.classList.add('dragover');
	});

	file.addEventListener('dragleave', () => {
		file.classList.remove('dragover');
	});

	file.addEventListener('drop', (e) => {
		e.preventDefault();
		file.classList.remove('dragover');

		const droppedFiles = e.dataTransfer.files;

		if (droppedFiles.length > 0) {
			file.querySelector('input').files = droppedFiles;

			handleFiles(file.querySelector('input'), fileText);
		}
	});
});

