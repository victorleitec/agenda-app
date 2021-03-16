import {Component, OnInit} from '@angular/core';
import {ContatoService} from '../contato.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Contato} from './contato';
import Swal from 'sweetalert2';
import {MatDialog} from '@angular/material/dialog';
import {ContatoDetalheComponent} from '../contato-detalhe/contato-detalhe.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];

  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptions: number[] = [10];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.montarFormulario();
    this.listarContatos(this.pagina, this.tamanho);
  }

  montarFormulario() {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    const formValues = this.formulario.value, contato: Contato = new Contato(formValues.nome, formValues.email);

    if (contato.nome != '' && contato.email != '') {
      this.service.salva(contato)
        .subscribe(resposta => {
            this.contatos = [...this.contatos, resposta];

            Swal.fire({
              position: 'center',
              background: 'rgba(206, 246, 216)',
              backdrop: 'rgba(0, 0, 0, 0.2)',
              icon: 'success',
              iconColor: 'green',
              title: 'SUCESSO',
              padding: '10px',
              text: 'Contato adicionado!',
              showConfirmButton: false,
              width: '350px',
              timer: 1200,
            });
            this.ngOnInit();
          }
        );
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        background: 'rgba(255, 0, 0, 0.2)',
        backdrop: 'rgba(0, 0, 0, 0.05)',
        iconColor: '#cc0000',
        title: 'FALHA',
        padding: '10px',
        text: 'Nome e/ou Email inválido(s)!',
        showConfirmButton: false,
        width: '350px',
        timer: 1200
      });
    }
  }

  listarContatos(page?: number, size?: number) {
    this.service.lista(page, size)
      .subscribe(resposta => {
        this.contatos = resposta.content;
        this.totalElementos = resposta.totalElements;
        this.pagina = resposta.number;
      });
  }

  favoritar(contato: Contato) {
    this.service.favorita(contato)
      .subscribe(resposta => {
        contato.favorito = !contato.favorito;
      });
  }

  uploadFoto(event: any, contato: Contato) {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append('foto', foto);

      this.service
        .upload(contato, formData)
        .subscribe(resposta =>
          this.listarContatos(this.pagina, this.tamanho));
    }
  }

  visualizarContato(contato: Contato) {
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '450px',
      data: contato
    });
  }

  paginar(event: PageEvent) {
    this.pagina = event.pageIndex;
    this.listarContatos(this.pagina, this.tamanho)
  }
}
