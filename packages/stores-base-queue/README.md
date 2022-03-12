# @crikey/stores-base-queue

Internal peer package used to solve the diamond dependency problem.

```mermaid
  graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
```
