import { map, Observable } from "rxjs";
import { Task } from "../entity/task";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
  return this.http.delete(this.url+"/tasks/"+id);
}

createTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.url+"/tasks", task);
}

updateTask(task: Task): Observable<any>{
  return this.http.put<any>(this.url+"/tasks/"+task.id, task);
}


}
