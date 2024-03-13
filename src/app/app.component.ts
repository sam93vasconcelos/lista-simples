import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Lista';
  items: Array<{ id: number; control: FormControl; checked: FormControl }> = [];

  constructor() {
    if (!localStorage.getItem('minhaLista')) {
      return;
    }

    const items = JSON.parse(localStorage.getItem('minhaLista') ?? '');

    items.forEach((item: any) => {
      this.items = [
        ...this.items,
        {
          id: item.id,
          control: new FormControl(item.value),
          checked: new FormControl(item.checked),
        },
      ];
    });
  }

  addItem(): void {
    const valueControl = new FormControl();
    const checkControl = new FormControl(false);

    const lastItem = this.items.length
      ? this.items.reduce((a, b) => (a.id > b.id ? a : b))
      : null;

    valueControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.handlePersist());

    checkControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => this.handlePersist());

    this.items = [
      ...this.items,
      {
        id: lastItem ? lastItem.id + 1 : 1,
        control: valueControl,
        checked: checkControl,
      },
    ];
  }

  removeItem(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.handlePersist();
  }

  handlePersist(): void {
    let data: any = [];

    this.items.forEach((item) => {
      data = [
        ...data,
        {
          id: item.id,
          value: item.control.value,
          checked: item.checked.value,
        },
      ];
    });

    localStorage.setItem('minhaLista', JSON.stringify(data));
  }
}
