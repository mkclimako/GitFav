import { GithubUser } from "./GithubUser.js";

// Classe que  vai conter a lógica dos dados
//Como os dados serão estruturados

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
  }
  

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('User already exists')
      }

      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error('User not found');
      }

      this.entries = [user,...this.entries]
      console.log(this.entries)
      this.update()
      this.save()

    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );
    this.entries = filteredEntries;
    this.update();
    this.save()
  }
}

// Classe que vai criar a vizualização do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector('table tbody');
    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector('.add');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#input-search');
      this.add(value);
    };

  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href =`https://github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;
      row.querySelector('.following').textContent = user.following;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover essa linha?');

        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td class="user">
    <img
      src=""
      alt=""
    />
    <a href="" target="_blank"
      ><p></p>
      <span></span></a
    >
  </td>
  <td class="repositories"></td>

  <td class="followers"></td>
  <td class="following"></td>

  <td>
    <button class="remove">remove</button>
  </td>`;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });
  }
}
