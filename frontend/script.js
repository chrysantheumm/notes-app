const API_BASE_URL = 'http://localhost:3000/api';

const notesGrid = document.getElementById('notesGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const totalNotesCount = document.getElementById('totalNotesCount');
const btnCancelForm = document.getElementById('btnCancelForm');
const btnSubmitForm = document.getElementById('btnSubmitForm');
const formPanelTitle = document.getElementById('formPanelTitle');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editNoteId = document.getElementById('editNoteId');
const editJudul = document.getElementById('editJudul');
const editIsi = document.getElementById('editIsi');
const btnCancelModal = document.getElementById('btnCancelModal');
const closeModalBtn = document.getElementById('closeModalBtn');

let allNotes = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchNotes();
  setupEventListeners();
});

function setupEventListeners() {
  noteForm.addEventListener('submit', handleAddNote);
  closeModalBtn.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  editForm.addEventListener('submit', handleUpdateNote);

  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      closeModal();
    }
  });

  document.getElementById('btnNewNoteSidebar').addEventListener('click', () => {
    document.getElementById('noteFormPanel').scrollIntoView({ behavior: 'smooth' });
    judulInput.focus();
  });
}

async function fetchNotes() {
  showLoader(true);
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) throw new Error('Gagal mengambil data catatan.');
    
    allNotes = await response.json();
    renderNotes(allNotes);
  } catch (error) {
    console.error(error);
    showToast(error.message, 'danger');
  } finally {
    showLoader(false);
  }
}

function renderNotes(notes) {
  const cards = notesGrid.querySelectorAll('.note-card');
  cards.forEach(card => card.remove());

  totalNotesCount.textContent = notes.length;

  if (notes.length === 0) {
    emptyState.style.display = 'flex';
    return;
  }
  
  emptyState.style.display = 'none';

  notes.forEach(note => {
    const card = createNoteCard(note);
    notesGrid.appendChild(card);
  });
}

function createNoteCard(note) {
  const card = document.createElement('div');
  card.className = 'note-card';
  card.dataset.id = note.id;

  const dateFormatted = formatDate(note.tanggal_dibuat);

  card.innerHTML = `
    <div class="note-card-header">
      <h3 class="note-card-title">${escapeHTML(note.judul)}</h3>
      <div class="note-card-date">
        <span>${dateFormatted}</span>
      </div>
    </div>
    <div class="note-card-body">${escapeHTML(note.isi)}</div>
    <div class="note-card-actions">
      <button class="btn-edit" onclick="openEditModal(${note.id})">Edit</button>
      <button class="btn-delete" onclick="deleteNote(${note.id})">Hapus</button>
    </div>
  `;

  return card;
}

async function handleAddNote(e) {
  e.preventDefault();

  const judul = judulInput.value.trim();
  const isi = isiInput.value.trim();

  if (!judul || !isi) return;

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, isi })
    });

    if (!response.ok) throw new Error('Gagal menyimpan catatan baru.');

    const newNote = await response.json();
    allNotes.unshift(newNote);
    renderNotes(allNotes);

    noteForm.reset();
    showToast('Catatan berhasil ditambahkan!', 'success');
  } catch (error) {
    console.error(error);
    showToast(error.message, 'danger');
  }
}

async function deleteNote(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Gagal menghapus catatan.');

    allNotes = allNotes.filter(note => note.id !== id);
    renderNotes(allNotes);
    showToast('Catatan berhasil dihapus!', 'success');
  } catch (error) {
    console.error(error);
    showToast(error.message, 'danger');
  }
}

function openEditModal(id) {
  const note = allNotes.find(n => n.id === id);
  if (!note) return;

  editNoteId.value = note.id;
  editJudul.value = note.judul;
  editIsi.value = note.isi;

  editModal.classList.add('active');
}

function closeModal() {
  editModal.classList.remove('active');
  editForm.reset();
}

async function handleUpdateNote(e) {
  e.preventDefault();

  const id = editNoteId.value;
  const judul = editJudul.value.trim();
  const isi = editIsi.value.trim();

  if (!id || !judul || !isi) return;

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, isi })
    });

    if (!response.ok) throw new Error('Gagal memperbarui catatan.');

    const updatedNote = await response.json();
    
    allNotes = allNotes.map(n => n.id === parseInt(id) ? { ...n, judul, isi } : n);
    renderNotes(allNotes);

    closeModal();
    showToast('Catatan berhasil diperbarui!', 'success');
  } catch (error) {
    console.error(error);
    showToast(error.message, 'danger');
  }
}

function showLoader(show) {
  loadingState.style.display = show ? 'flex' : 'none';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
