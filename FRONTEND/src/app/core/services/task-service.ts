import { map, Observable, Subject, tap } from "rxjs";
import { Task } from "../entity/task";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;

  private taskChangedSubject = new Subject<void>();
  taskChanged$ = this.taskChangedSubject.asObservable();

getTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.url+"/tasks");
}

getAllTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.url+"/tasks/all");
}

getTask(id: number): Observable<Task> {
  return this.http.get<Task>(this.url+"/tasks/"+id);
}

deleteTask(id: number): Observable<any> {
  return this.http.delete(this.url+"/tasks/"+id).pipe(
      tap(() => this.taskChangedSubject.next())
    );
}

createTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.url+"/tasks", task).pipe(
      tap(() => this.taskChangedSubject.next())
    );
}

updateTask(task: Task): Observable<any>{
  return this.http.put<any>(this.url+"/tasks/"+task.id, task).pipe(
      tap(() => this.taskChangedSubject.next())
    );
}


}
