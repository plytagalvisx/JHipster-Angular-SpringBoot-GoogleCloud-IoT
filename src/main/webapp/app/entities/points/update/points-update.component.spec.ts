jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PointsService } from '../service/points.service';
import { IPoints, Points } from '../points.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { PointsUpdateComponent } from './points-update.component';

describe('Component Tests', () => {
  describe('Points Management Update Component', () => {
    let comp: PointsUpdateComponent;
    let fixture: ComponentFixture<PointsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pointsService: PointsService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PointsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PointsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PointsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pointsService = TestBed.inject(PointsService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const points: IPoints = { id: 456 };
        const user: IUser = { id: 13820 };
        points.user = user;

        const userCollection: IUser[] = [{ id: 8136 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ points });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        //expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      /*it('Should update editForm', () => {
        const points: IPoints = { id: 456 };
        const user: IUser = { id: 62330 };
        points.user = user;

        activatedRoute.data = of({ points });
        comp.ngOnInit();

        //expect(comp.editForm.value).toEqual(expect.objectContaining(points));
        //expect(comp.usersSharedCollection).toContain(user);
      });*/
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const points = { id: 123 };
        spyOn(pointsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ points });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: points }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pointsService.update).toHaveBeenCalledWith(points);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const points = new Points();
        spyOn(pointsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ points });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: points }));
        saveSubject.complete();

        // THEN
        expect(pointsService.create).toHaveBeenCalledWith(points);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const points = { id: 123 };
        spyOn(pointsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ points });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pointsService.update).toHaveBeenCalledWith(points);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
