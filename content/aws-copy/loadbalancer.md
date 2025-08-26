# AWS Load Balancer

AWS provides several types of load balancers to distribute incoming application traffic across multiple targets, such as EC2 instances, containers, and IP addresses. Load balancing increases the availability and fault tolerance of your application.

## Types of AWS Load Balancers

### 1. Application Load Balancer (ALB)
- Operates at the application layer (HTTP/HTTPS).
- Supports path-based and host-based routing.
- Ideal for microservices and container-based architectures.

### 2. Network Load Balancer (NLB)
- Operates at the transport layer (TCP/UDP).
- Handles millions of requests per second with ultra-low latency.
- Suitable for high-performance and static IP requirements.

### 3. Classic Load Balancer (CLB)
- Operates at both the application and transport layers.
- Legacy option, recommended only for existing workloads.

## Key Features

- **Health Checks:** Automatically checks the health of registered targets.
- **SSL Termination:** Offloads SSL decryption at the load balancer.
- **Sticky Sessions:** Routes requests from the same client to the same target.
- **Auto Scaling Integration:** Works seamlessly with EC2 Auto Scaling.

## Basic Setup Steps

1. Choose the appropriate load balancer type.
2. Configure listeners and routing rules.
3. Register targets (EC2 instances, containers, etc.).
4. Set up health checks.
5. Test and monitor using AWS Console or CLI.

## Useful Resources

- [AWS Load Balancing Documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/)
- [Getting Started with Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/getting-started/)
