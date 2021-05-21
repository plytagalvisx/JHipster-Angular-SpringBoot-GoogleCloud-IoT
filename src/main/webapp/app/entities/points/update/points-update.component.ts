import { Services } from './../../../admin/metrics/metrics.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';

import { IPoints } from 'app/shared/model/points.model';
import { IUser } from 'app/core/user/user.model';
import { Principal } from 'app/core/auth/principal.service';
import { PointsService } from '../service/points.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-points-update',
  templateUrl: './points-update.component.html',
})
export class PointsUpdateComponent implements OnInit {
  points: IPoints | any;
  isSaving: boolean | any;

  users: IUser[] | any;
  dateDp: any;

  constructor(
    private jhiAlertService: JhiAlertService,
    private pointsService: PointsService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private principal: Principal
  ) {}

  ngOnInit(): any {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ points }) => {
      this.points = points;
    });
    this.principal.hasAuthority('ROLE_ADMIN').then(isAdmin => {
      if (isAdmin) {
        this.userService.query().subscribe(
          (res: HttpResponse<IUser[]>) => {
            this.users = res.body;
          },
          (res: HttpErrorResponse) => {
            this.onError(res.message);
          }
        );
      }
    });
  }

  previousState(): any {
    window.history.back();
  }

  trackUserById(index: number, item: IUser): number {
    return item.id as number;
  }

  save(): any {
    this.isSaving = true;

    // convert booleans to ints
    this.points.exercise = this.points.exercise ? 1 : 0;
    this.points.meals = this.points.meals ? 1 : 0;
    this.points.alcohol = this.points.alcohol ? 1 : 0;

    if (this.points.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsService.update(this.points) as any);
    } else {
      this.subscribeToSaveResponse(this.pointsService.create(this.points) as any);
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IPoints>>): any {
    result.subscribe(
      (res: HttpResponse<IPoints>) => {
        this.onSaveSuccess();
      },
      (res: HttpErrorResponse) => {
        this.onSaveError();
      }
    );
  }

  private onSaveSuccess(): any {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): any {
    this.isSaving = false;
  }

  private onError(errorMessage: string): any {
    this.jhiAlertService.error(errorMessage, null, undefined);
  }
}
