import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [str, setStr] = useState("");
  const [hash, setHash] = useState("");
  const [err, setErr] = useState("");
  const [encryptionMethod, setEncryptionMethod] = useState("ascii");
  const shift = 10; // Сдвиг для шифра Цезаря
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Изменение строки
  const handleChangeStr = (e) => {
    setStr(e.target.value);
    encrypt(e.target.value);
  };

  // Изменение хеша
  const handleChangeHash = (e) => {
    setHash(e.target.value);
    decrypt(e.target.value);
  };

  // Изменение метода шифрования
  const handleChangeMethod = (e) => {
    setEncryptionMethod(e.target.value);
    encrypt(str); // Обновляем зашифрованный текст при смене метода
  };

  const encrypt = (str) => {
    if (!str) return;
    let encodedStr;
    if (encryptionMethod === "ascii") {
      encodedStr = str.split('').map(char => "," + char.charCodeAt(0)).join('').substring(1);
    } else if (encryptionMethod === "base64") {
      encodedStr = btoa(unescape(encodeURIComponent(str)));
    } else if (encryptionMethod === "caesar") {
      encodedStr = caesarCipher(str, shift);
    }
    setHash(encodedStr);
  };

  const decrypt = (hash) => {
    if (!hash) { setStr(""); return; }
    setErr("");
    let decodedStr;
    if (encryptionMethod === "ascii") {
      let arrStr = hash.split(',').map(char => String.fromCharCode(char));
      decodedStr = arrStr.join('');
    } else if (encryptionMethod === "base64") {
      try {
        decodedStr = decodeURIComponent(escape(atob(hash)));
      } catch (error) {
        setErr("Ошибка при декодировании Base64: " + error.message);
        return;
      }
    } else if (encryptionMethod === "caesar") {
      decodedStr = caesarCipher(hash, -shift); // Дешифрование
    }
    setStr(decodedStr);
  };

  const caesarCipher = (text, shift) => {
    return text.split('').map(char => {
      let code = char.charCodeAt();
      let lower;

      // Латинские буквы (A-Z, a-z)
      if (code >= 65 && code <= 90) { // A-Z
        lower = 65;
        return String.fromCharCode(((code - lower + shift + 26) % 26) + lower);
      } else if (code >= 97 && code <= 122) { // a-z
        lower = 97;
        return String.fromCharCode(((code - lower + shift + 26) % 26) + lower);
      }

      // Русские буквы (А-Я, а-я)
      if (code >= 1040 && code <= 1071) { // А-Я
        lower = 1040;
        return String.fromCharCode(((code - lower + shift + 32) % 32) + lower);
      } else if (code >= 1072 && code <= 1103) { // а-я
        lower = 1072;
        return String.fromCharCode(((code - lower + shift + 32) % 32) + lower);
      }

      return char; // Возвращаем символ без изменений, если это не буква
    }).join('');
  };

  // Установка высоты textarea
  const handleAutoResize = (e) => {
    e.target.style.height = 'auto'; // Сбрасываем высоту
    e.target.style.height = `${e.target.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
  };

  // Используем useEffect для обновления высоты при изменении 'hash'
  useEffect(() => {
    const textarea = document.getElementById('hashTextarea');
    if (textarea) {
      textarea.style.height = 'auto'; // Сбрасываем высоту
      textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [hash]);

  // Вместе с обновлением хэш текстовой области, изменяем высоту строки
  useEffect(() => {
    const textarea = document.getElementById('stringTextarea');
    if (textarea) {
      textarea.style.height = 'auto'; // Сбрасываем высоту
      textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
    }
  }, [str]);

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className="flex flex-col gap-4 bg-gray-200 bg-opacity-70 rounded-xl p-8 h-auto max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-1">
          <label className="text-sm">Строка</label>
          <textarea
            id="stringTextarea"
            value={str}
            onChange={(e) => {
              handleChangeStr(e);
              handleAutoResize(e);
            }}
            style={{ overflow: 'hidden' }}
            className="min-w-[250px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Шифр</label>
          <textarea
            id="hashTextarea"
            value={hash}
            onChange={(e) => {
              handleChangeHash(e);
              handleAutoResize(e);
            }}
            className="min-w-[250px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 resize-none"
            style={{ overflow: 'hidden' }} // чтобы убрать полосу прокрутки
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm">Метод шифрования</label>
          <select
            value={encryptionMethod}
            onChange={handleChangeMethod}
            className="min-w-[250px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="ascii">ASCII</option>
            <option value="base64">Base64</option>
            <option value="caesar">Шифр Цезаря</option>
          </select>
        </div>

        <div className={"flex justify-end"}>
          <p className={"font-medium p-2"} onClick={toggleModal}>?</p>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-2 shadow-lg relative">
                <button
                    className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
                    onClick={toggleModal}
                >
                  &times;
                </button>
                <h2 className={"mb-2 font-medium text-lg"}>Справка</h2>
                <div className={"flex flex-col gap-2"}>
                <p>Шифрование с помощью:<br/>
                  1. Шифрование с использованием таблицы ASCII
                  Каждый символ строки преобразуется в его ASCII-значение,
                  а затем применяется операция (например, прибавление значения)
                  для изменения этих значений.



                 </p>
                <p>2. Base64
                  Метод кодирования бинарных данных в текстовом формате.
                  Каждые 3 байта входных данных преобразуются в 4 символа
                  Base64, используя 64 символа.</p>
                <p> 3. Шифр Цезаря
                  Простой алгоритм, который сдвигает каждую букву текста
                  на фиксированное число позиций в алфавите.
                  Например, сдвиг на 3 означает, что 'A' станет 'D'.</p>
                </div>
              </div>
            </div>
        )}

        {err && <p className='text-red-500'>{err}</p>}
      </div>
    </div>
  );
}

export default App;
