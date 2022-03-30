import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Curriculum } from 'src/app/core/models/interfaces/curriculum';
import { Experience } from 'src/app/core/models/interfaces/experience';
import { User } from 'src/app/core/models/interfaces/user';
import { CurriculumService } from 'src/app/curriculum/curriculum.service';
import { HeaderService } from 'src/app/shared/header/header.service';
import { TokenService } from '../../login/token.service';

import { UsersFormModalService } from '../../users/modals/users-form-modal.service';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'private-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  users: User[];
  usersDataSource: MatTableDataSource<User>;
  displayedColumns: string[] = [
    'nombre',
    'apellidos',
    'email',
    'activo',
    'actions',
  ];
  displayedColumnsSmallScreens: string[] = ['info', 'actions'];
  isSmallScreen = false;

  errorMsg: string;
  spinnerOn = false;
  chargeCompleted = false;
  constructor(
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private usersService: UsersService,
    private usersFormModalService: UsersFormModalService,
    private router: Router
  ) {}

  async ngOnInit() {
    //Nos suscribimos a breackpointobserver para escuchar cuando cambia el tamaño de la pantalla y cambiar el flag cuando se pasa el límite de 500px
    this.breakpointObserver
      .observe(['(max-width: 550px)'])
      .subscribe(async (state) => {
        this.isSmallScreen = state.matches;
        await this.getUsers();

        });
  }

  ngAfterViewInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.usersDataSource = new MatTableDataSource(users);
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    });
  }
  async onDeleteClick(user: User) {
    this.usersService.deleteUser(user).subscribe(
     async (resp) => {
        if (resp.status && resp.status === 'ok') {
          this.usersFormModalService.openModal(true, 'Usuario eliminado correctamente.');
          await this.getUsers()
        }
        this.spinnerOn = false;
      },
      (error) => {
        console.log(error)
        this.usersFormModalService.openModal(false, 'Ha ocurrido un error inesperado, por favor, vuelve a intentarlo más tarde.');

        this.spinnerOn = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();

    if (this.usersDataSource.paginator) {
      this.usersDataSource.paginator.firstPage();
    }
  }

  onUpdateClick(user: User) {
    this.router.navigate(['admin', 'admin-users', 'form'], {
      queryParams: { idUsuario: user.idUsuario },
    });
  }

  onAddClick() {
    this.router.navigate(['admin', 'admin-users', 'form']);
  }


  async getUsers(){
    await this.usersService.getUsers().toPromise().then((users) => {
      this.usersDataSource = new MatTableDataSource(users);
      this.usersDataSource.paginator = this.paginator;
      this.usersDataSource.sort = this.sort;
    });
  }
}
